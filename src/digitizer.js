import { Image } from "image-js";
import { LOCALE_BLOOD_GLUCOSE_LEVELS as GLUCOSE_LEVELS } from "./constants";

const black = 5;
const [glucoseMin, glucoseMax] = GLUCOSE_LEVELS.range;

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
  let maxC = 0;
  let minC = null;
  img.getColumn(1).forEach((px, i) => {
    if (isBlack(px)) {
      minC = minC || i;
      maxC = i;
    }
  });
  let maxR = null;
  img.getRow(maxC - 2).forEach((px, i) => {
    if (isBlack(px)) {
      maxR = i;
    }
  });
  return img.crop({ y: minC, height: maxC - minC, width: maxR });
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
  img = img
    .mask()
    .rgba8()
    .grey();
  img = img.erode({ iterations: 2 });
  const data = [];
  for (let index = 0; index < img.width; index++) {
    const column = img
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
  return data;
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

// function print(img, id = "None") {
//   let el = document.createElement("img");
//   el.id = id;
//   el.width = 400;
//   document.body.append(el);
//   el.src = img.toDataURL();
// }

async function process(i) {
  let image = await Image.load(i);
  let grey = greyImg(image.rgba8()).invert();
  let crop = getCrop(grey);
  let rawData = getRawData(crop);
  let graphData = getGraphData(rawData, getGraphDimensions(crop));
  return graphData;
}

export default process;
