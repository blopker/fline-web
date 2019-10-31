import React, { memo } from "react";
import PropTypes from "prop-types";
import red from "@material-ui/core/colors/red";
import grey from "@material-ui/core/colors/grey";
import { withTheme } from "@material-ui/core/styles";
import { Group } from "@vx/group";
import { scaleTime, scaleLinear } from "@vx/scale";
import { LinePath, AreaClosed } from "@vx/shape";
import { AxisLeft, AxisBottom, AxisTop, AxisRight } from "@vx/axis";
import { Grid } from "@vx/grid";
import { curveCatmullRom } from "@vx/curve";
import { Text } from "@vx/text";
import { format, addHours, isWithinInterval } from "date-fns";
import range from "lodash/range";
import NotEnoughDataMessage from "../../log/NotEnoughDataMessage";
import { LOCALE_BLOOD_GLUCOSE_LEVELS as GLUCOSE_LEVELS } from "../../constants";

/**
 * Renders a graph of glucose levels for the following three hours after a food
 * log entry, and one hour prior.
 */

const GraphsPreview = memo(props => {
  const { firstGraph, secondGraph, theme } = props;
  const firstGraphEntryDate = firstGraph.entry.date;

  const firstGraphTimes = {
    entryDate: firstGraphEntryDate,
    oneHourEarlier: addHours(firstGraphEntryDate, -1),
    oneHourLater: addHours(firstGraphEntryDate, 1),
    twoHoursLater: addHours(firstGraphEntryDate, 2),
    threeHoursLater: addHours(firstGraphEntryDate, 3)
  };

  const firstGraphLineInterval = {
    start: firstGraphTimes.oneHourEarlier,
    end: firstGraphTimes.threeHoursLater
  };

  const firstGraphAreaInterval = {
    start: firstGraphTimes.entryDate,
    end: firstGraphTimes.twoHoursLater
  };

  const firstGraphLineSeries = [];
  const firstGraphAreaSeries = [];

  firstGraph.bloodGlucoseLevels.forEach(reading => {
    const x = reading.date;
    const y = reading.level;

    if (isWithinInterval(x, firstGraphLineInterval)) {
      firstGraphLineSeries.push({ x, y });

      if (isWithinInterval(x, firstGraphAreaInterval)) {
        firstGraphAreaSeries.push({ x, y });
      }
    }
  });

  const secondGraphEntryDate = secondGraph.entry.date;

  const secondGraphTimes = {
    entryDate: secondGraphEntryDate,
    oneHourEarlier: addHours(secondGraphEntryDate, -1),
    oneHourLater: addHours(secondGraphEntryDate, 1),
    twoHoursLater: addHours(secondGraphEntryDate, 2),
    threeHoursLater: addHours(secondGraphEntryDate, 3)
  };

  const secondGraphLineInterval = {
    start: secondGraphTimes.oneHourEarlier,
    end: secondGraphTimes.threeHoursLater
  };

  const secondGraphAreaInterval = {
    start: secondGraphTimes.entryDate,
    end: secondGraphTimes.twoHoursLater
  };

  const secondGraphLineSeries = [];
  const secondGraphAreaSeries = [];

  secondGraph.bloodGlucoseLevels.forEach(reading => {
    const x = reading.date;
    const y = reading.level;

    if (isWithinInterval(x, secondGraphLineInterval)) {
      secondGraphLineSeries.push({ x, y });

      if (isWithinInterval(x, secondGraphAreaInterval)) {
        secondGraphAreaSeries.push({ x, y });
      }
    }
  });

  // Bail out if there is not enough data within the time frame
  if (firstGraphAreaSeries.length < 2 || secondGraphAreaSeries.length < 2) {
    return <NotEnoughDataMessage />;
  }

  const yExtent = [
    Math.min(...firstGraphLineSeries.map(d => d.y), ...secondGraphLineSeries.map(d => d.y)),
    Math.max(...firstGraphLineSeries.map(d => d.y), ...secondGraphLineSeries.map(d => d.y))
  ];

  const width = 1417;
  const height = 1700;

  
  // Draw a graph that is sized to the viewport width
  return (
    <div
      style={{
        width,
        height,
        marginBottom: theme.spacing(2),
        visibility: "hidden",
        position: "absolute"
      }}
    >
      <svg
        id="graph-preview"
        width={width}
        height={height}
        style={{ background: "white", fontFamily: theme.typography.fontFamily }}
      >
        <Graph
          width={width}
          height={height / 2}
          lineSeries={firstGraphLineSeries}
          areaSeries={firstGraphAreaSeries}
          times={firstGraphTimes}
          yExtent={yExtent}
          marginTop={0}
          title={firstGraph.entry.description}
          theme={theme}
        />
        <Graph
          width={width}
          height={height / 2}
          lineSeries={secondGraphLineSeries}
          areaSeries={secondGraphAreaSeries}
          times={secondGraphTimes}
          yExtent={yExtent}
          marginTop={height / 2}
          title={secondGraph.entry.description}
          theme={theme}
        />
      </svg>
    </div>
  );
});

/**
 * The Graph helper component does the SVG heavy lifting.
 */

const Graph = memo(props => {
  const { width, height, lineSeries, areaSeries, yExtent, marginTop, title, theme } = props;

  if (!(width && height)) {
    return null;
  }

  const {
    entryDate,
    oneHourEarlier,
    oneHourLater,
    twoHoursLater,
    threeHoursLater
  } = props.times;

  // The baseline is where the glucose level started off at the logged entry
  // time. Any glucose increases/decrease from the baseline will be shaded in.
  const baseline = areaSeries[0].y;

  const margin = {
    top: theme.spacing(8),
    right: theme.spacing(8),
    bottom: theme.spacing(8),
    left: theme.spacing(12)
  };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleTime({
    range: [0, xMax],
    domain: [oneHourEarlier, threeHoursLater]
  });

  // Favor a more focused scale that is cropped around the good glucose levels,
  // but always ensure that the scale's domain fully fits the Y extent
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [
      Math.min(GLUCOSE_LEVELS.croppedRange[0], yExtent[0]),
      Math.max(GLUCOSE_LEVELS.croppedRange[1], yExtent[1])
    ],
    clamp: true,
    nice: true
  });

  const preferredNumberOfTicks = 4;
  let yTicks = yScale.ticks(preferredNumberOfTicks);
  let yGridLines = yScale.ticks(preferredNumberOfTicks);

  yTicks = yTicks.slice(1,-1);

  // If D3 doesn't generate four ticks, attempt to do better manually
  if (yTicks.length !== preferredNumberOfTicks) {
    const [domainMin, domainMax] = yScale.domain();
    const stepValue = (domainMax - domainMin) / (preferredNumberOfTicks - 1);
    if (Number.isInteger(stepValue)) {
      yTicks = range(domainMin, domainMax + stepValue, stepValue);
      yGridLines = range(domainMin, domainMax + stepValue / 2, stepValue / 2);
    }
  }

  const [goodGlucoseMin, goodGlucoseMax] = GLUCOSE_LEVELS.goodRange;

  return (
    <Group top={marginTop + margin.top} left={margin.left}>
      {/* green reference area designating the good glucose level ranges */}
      <rect
        x="0"
        y="0"
        width={xMax}
        height={yScale(goodGlucoseMax)}
        style={{
          fill: "#FFD7D6"
        }}
      />
      <rect
        x="0"
        y={yScale(goodGlucoseMax)}
        width={xMax}
        height={yScale(goodGlucoseMin) - yScale(goodGlucoseMax)}
        style={{
          fill: "#DAFED7"
        }}
      />
      <rect
        x="0"
        y={yScale(goodGlucoseMin)}
        width={xMax}
        height={yMax - yScale(goodGlucoseMin)}
        style={{
          fill: "#FFD7D6"
        }}
      />

      {/* the background grid lines */}
      <Grid
        xScale={xScale}
        yScale={yScale}
        width={xMax}
        height={yMax}
        stroke="rgba(255, 255, 255, 0.05)"
        columnTickValues={[
          oneHourEarlier,
          entryDate,
          oneHourLater,
          twoHoursLater,
          threeHoursLater
        ]}
        tickValues={yGridLines}
      />

      {/* redraw the event time and +2hr grid lines in a brighter color */}
      {/* <GridColumns
        scale={xScale}
        height={yMax}
        stroke={grey[800]}
        tickValues={[entryDate, twoHoursLater]}
      /> */}

      {/* the y-axis tracks the glucose level */}
      <AxisLeft
        scale={yScale}
        top={0}
        left={0}
        stroke={grey[900]}
        tickValues={yTicks}
        tickStroke={grey[900]}
        tickLabelProps={({ tick, index }) => ({
          dx: "-0.5em",
          dy: "0.5em",
          fill: grey[900],
          fontSize: "1.5em",
          fontFamily: `"Arial", sans-serif`,
          textAnchor: "end"
        })}
      />~
      <Text
        x="-1.8em"
        y="-0.5em"
        fontSize="1.5em"
        fontFamily={`"Arial", sans-serif`}
        fill={grey[900]}
      >
        glucose, mg/dL
      </Text>

      {/* the x-axis tracks time */}
      <AxisBottom
        scale={xScale}
        top={yMax}
        stroke={grey[900]}
        tickStroke={grey[900]}
        tickValues={[entryDate, twoHoursLater]}
        tickFormat={x => {
          if (x === twoHoursLater) {
            return "+2 hours";
          }
          return format(x, "h:mma")
            .toLowerCase()
            .replace(":00", "");
        }}
        tickLabelProps={({ tick, index }) => ({
          dy: "1.8em",
          fill: grey[900],
          fontSize: "1.5em",
          fontFamily: `"Arial", sans-serif`,
          textAnchor: "middle"
        })}
      />

      {/* the x-axis tracks time */}
      <AxisTop scale={xScale} stroke={grey[900]} hideTicks tickValues={[]} />
      <AxisRight
        scale={yScale}
        left={xMax}
        stroke={grey[900]}
        hideTicks
        tickValues={[]}
      />

      <Text
        fontSize="1.7em"
        fontFamily={`"Arial", sans-serif`}
        capHeight="2em"
        x={xMax / 2}
        textAnchor="middle"
        verticalAnchor="start"
        fill={grey[900]}
        scaleToFit
      >
        {title}
      </Text>

      {/* draw a line representing the glucose level */}
      <LinePath
        data={lineSeries}
        x={d => xScale(d.x)}
        y={d => yScale(d.y)}
        stroke={grey[900]}
        strokeWidth={2}
        curve={curveCatmullRom}
      />

      {/* shade any glucose increase above the baseline in teal */}
      <AreaClosed
        data={areaSeries}
        x={d => xScale(d.x)}
        y0={d => yScale(Math.min(d.y, baseline))}
        y1={d => yScale(d.y)}
        fill={grey[900]}
      />

      {/* shade any glucose decrease below the baseline in red */}
      <AreaClosed
        data={areaSeries}
        x={d => xScale(d.x)}
        y0={d => yScale(d.y)}
        y1={d => yScale(Math.max(d.y, baseline))}
        fill={red[600]}
      />
    </Group>
  );
});

GraphsPreview.propTypes = {
  firstGraph: PropTypes.object.isRequired,
  secondGraph: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

Graph.propTypes = {
  height: PropTypes.number,
  lineSeries: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  areaSeries: PropTypes.array.isRequired,
  times: PropTypes.object.isRequired,
  width: PropTypes.number
};

export default withTheme(GraphsPreview);
