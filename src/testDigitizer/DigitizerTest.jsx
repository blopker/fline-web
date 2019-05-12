import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import process from "../digitizer";
import DailyGraph from "../import/DailyGraph";
import Immutable from "immutable";

const styles = theme => ({});

const testImages = ["test-fr-units.png", "test-us-units.jpg"];
const androidImages = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg",
  "img5.jpg"
];

const iosImages = [
  "img1.jpg",
  "img11.PNG",
  "img13.PNG",
  "img15.PNG",
  "img17.jpeg",
  "img19.png",
  "img3.PNG",
  "img5.PNG",
  "img7.PNG",
  "img9.PNG",
  "img10.PNG",
  "img12.PNG",
  "img14.PNG",
  "img16.jpeg",
  "img18.png",
  "img2.png",
  "img4.PNG",
  "img6.PNG",
  "img8.PNG"
];

// Convert the digitizer X coordinates into ISO date format
const dateTimeFormatter = ({ x, y }) => {
  const d = new Date();
  // Convert fractional hours into HH:MM (eg: 10.5 -> 10:30)
  d.setHours(0, 0, x * 3600, 0);
  return {
    x: d.toISOString(),
    y: y
  };
};

function ImageTest(props) {
  const { image, root } = props;
  const path = `${root}/${image}`;

  const [data, setData] = useState();

  useEffect(() => {
    const processImage = async () => {
      const result = await process(path, true);
      result.graphData = Immutable.fromJS(
        result.graphData.map(dateTimeFormatter)
      );
      setData(result);
    };

    processImage();
  }, [path]);

  if (data) {
    return (
      <div>
        <div style={{ color: "white" }}>{path}</div>
        <div>
          <img height="500" src={data.image.toDataURL()} alt={image} />
          <img height="500" src={data.grey.toDataURL()} alt={image} />
          <img height="500" src={data.crop.toDataURL()} alt={image} />
          {/* <img height="500" src={data.maskImg.toDataURL()} alt={image} /> */}
          <img height="500" src={data.erodeImg.toDataURL()} alt={image} />
          <DailyGraph data={data.graphData} width={500} height={500} />
        </div>
      </div>
    );
  }
  return <div>loading</div>;
}

function _DigitizerTest(props) {
  let test;
  let android;
  let ios;

  test = testImages.map(i => {
    return <ImageTest image={i} key={`test/${i}`} root="/test_images" />;
  });
  android = androidImages.map(i => {
    return (
      <ImageTest image={i} key={`test/${i}`} root="/test_images/android" />
    );
  });
  ios = iosImages.map(i => {
    return <ImageTest image={i} key={`ios/${i}`} root="/test_images/ios" />;
  });
  return (
    <div className={props.classes.main}>
      <Typography className={props.classes.text} variant="h2" gutterBottom>
        Test
      </Typography>
      {test}
      <Typography className={props.classes.text} variant="h2" gutterBottom>
        Android
      </Typography>
      {android}
      <Typography className={props.classes.text} variant="h2" gutterBottom>
        iOS
      </Typography>
      {ios}
    </div>
  );
}

let DigitizerTest = withStyles(styles)(_DigitizerTest);

export default DigitizerTest;
