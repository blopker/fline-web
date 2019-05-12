import { Image } from "image-js";
import { LOCALE_BLOOD_GLUCOSE_LEVELS as GLUCOSE_LEVELS } from "./constants";

let _debug = false;
const black = 5;
const [glucoseMin, glucoseMax] = GLUCOSE_LEVELS.range;

function log(msg) {
  if (_debug) {
    console.log(msg);
  }
}

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

function greyImg(img) {
  return img.grey({ algorithm: "green" });
}

function isBlack(px) {
  return px < black;
}

function getCrop(img) {
  // Image is color inverted at this point.
  // Grab the first column of the image and start in the middle.
  // Go up until you find the first non-black pixel, that's the top.
  // Start in the middle again, go down until the first non-black pixel. That's the bottom.
  // Get the row that's 2 pixels above the bottom you found and find the first non-black
  // pixel to the right. That's the width.
  // column[0] is the top left.
  const column = img.getColumn(1);
  const columnLength = column.length;
  const columnMid = Math.floor(columnLength / 2);
  let maxC = columnLength;
  let minC = null;

  for (let i = columnMid; i < columnLength; i++) {
    let px = column[i];
    if (!isBlack(px)) {
      maxC = i - 2;
      break;
    }
  }

  for (let i = columnMid; i > 0; i--) {
    let px = column[i];
    if (!isBlack(px)) {
      minC = i + 2;
      break;
    }
  }

  let maxR = null;
  img.getRow(maxC - 1).forEach((px, i) => {
    if (isBlack(px)) {
      maxR = i;
    }
  });
  const crop = { y: minC, height: maxC - minC, width: maxR };
  log("Crop:");
  log(crop);
  return img.crop(crop);
}

function isLine(pxs) {
  return (
    pxs
      .map(px => {
        return !isBlack(px);
      })
      .reduce((p, c) => p + c) >
    pxs.length * 0.7
  );
}
function getGraphDimensions(img) {
  let minY = null;
  let maxY = 0;
  img.getColumn(Math.floor(img.width / 2)).forEach((px, i) => {
    if (!isBlack(px) && isLine(img.getRow(i))) {
      minY = minY || i;
      maxY = i;
    }
  });
  let minX = null;
  let maxX = 0;
  img.getRow(maxY).forEach((px, i) => {
    if (!isBlack(px)) {
      minX = minX || i;
      maxX = i;
    }
  });
  return { maxY, minY, maxX, minX };
}

function getRawData(img) {
  const maskImg = img
    .mask({ threshold: 0.7 })
    .rgba8()
    .grey();
  const erodeImg = maskImg.erode({ iterations: 2 });
  const data = [];
  for (let index = 0; index < erodeImg.width; index++) {
    const column = erodeImg
      .getColumn(index)
      .map((v, i) => (v > 10 ? i : -1))
      .filter(a => a > 0);
    let med = median(column);
    if (med) {
      data.push({ x: index, y: med });
    }
  }
  // console.log(data);
  // print(img);
  return { rawData: data, erodeImg, maskImg };
}

function map_coord(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function getGraphData(rawData, dems) {
  return rawData.map(d => ({
    x: map_coord(d.x, dems.minX, dems.maxX, 0, 24),
    y: glucoseMax - map_coord(d.y, dems.minY, dems.maxY, glucoseMin, glucoseMax)
  }));
}

async function process(i, debug) {
  _debug = debug;
  let image = await Image.load(i);
  log(`Processing: ${i}`);
  let grey = greyImg(image.rgba8()).invert();
  let crop = getCrop(grey);
  let { rawData, erodeImg, maskImg } = getRawData(crop);
  let graphData = getGraphData(rawData, getGraphDimensions(crop));
  if (debug) {
    return { image, grey, crop, erodeImg, maskImg, rawData, graphData };
  } else {
    return graphData;
  }
}

export default process;
