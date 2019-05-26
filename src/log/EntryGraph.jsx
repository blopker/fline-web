import React, { memo } from "react";
import PropTypes from "prop-types";
import teal from "@material-ui/core/colors/teal";
import red from "@material-ui/core/colors/red";
import amber from "@material-ui/core/colors/amber";
import { withTheme } from "@material-ui/core/styles";
import { Group } from "@vx/group";
import { scaleTime, scaleLinear } from "@vx/scale";
import { LinePath, AreaClosed } from "@vx/shape";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Grid, GridColumns } from "@vx/grid";
import { AnnotationLabel } from "react-annotation";
import { curveCatmullRom } from "@vx/curve";
import { format, addHours, isWithinInterval } from "date-fns";
import truncate from "lodash/truncate";
import range from "lodash/range";
import ResponsiveWrapper from "../ResponsiveWrapper";
import NotEnoughDataMessage from "./NotEnoughDataMessage";
import { LOCALE_BLOOD_GLUCOSE_LEVELS as GLUCOSE_LEVELS } from "../constants";

/**
 * Renders a graph of glucose levels for the following three hours after a food
 * log entry, and one hour prior.
 */

const EntryGraph = memo(props => {
  const { entry, subsequentEntry, bloodGlucoseLevels, theme } = props;
  const entryDate = entry.date;

  const times = {
    entryDate: entryDate,
    oneHourEarlier: addHours(entryDate, -1),
    oneHourLater: addHours(entryDate, 1),
    twoHoursLater: addHours(entryDate, 2),
    threeHoursLater: addHours(entryDate, 3)
  };

  const lineInterval = {
    start: times.oneHourEarlier,
    end: times.threeHoursLater
  };

  const areaInterval = {
    start: times.entryDate,
    end: times.twoHoursLater
  };

  const lineSeries = [];
  const areaSeries = [];

  bloodGlucoseLevels.forEach(reading => {
    const x = reading.date;
    const y = reading.level;

    if (isWithinInterval(x, lineInterval)) {
      lineSeries.push({ x, y });

      if (isWithinInterval(x, areaInterval)) {
        areaSeries.push({ x, y });
      }
    }
  });

  // Bail out if there is not enough data within the time frame
  if (areaSeries.length < 2) {
    return <NotEnoughDataMessage />;
  }

  // Inspect the next log entry in chronological order. If it occurs within 3
  // hours of current entry, it will be marked and annotated on the graph.
  let annotation = null;
  if (subsequentEntry && subsequentEntry.date <= times.threeHoursLater) {
    annotation = subsequentEntry;
  }

  // Draw a graph that is sized to the viewport width
  return (
    <div style={{ height: 180, marginBottom: theme.spacing.unit * 2 }}>
      <ResponsiveWrapper>
        {({ width, height }) => (
          <Graph
            width={width}
            height={height}
            lineSeries={lineSeries}
            areaSeries={areaSeries}
            times={times}
            theme={theme}
            annotation={annotation}
          />
        )}
      </ResponsiveWrapper>
    </div>
  );
});

/**
 * The Graph helper component does the SVG heavy lifting.
 */

const Graph = memo(props => {
  const { width, height, lineSeries, areaSeries, theme, annotation } = props;

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
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 4,
    left: theme.spacing.unit * 5
  };

  if (annotation) {
    // Make additional room for the annotated text
    margin.top = theme.spacing.unit * 4;
  }

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleTime({
    range: [0, xMax],
    domain: [oneHourEarlier, threeHoursLater]
  });

  const yExtent = [
    Math.min(...lineSeries.map(d => d.y)),
    Math.max(...lineSeries.map(d => d.y))
  ];

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

  // If D3 doesn't generate four ticks, attempt to do better manually
  if (yTicks.length !== preferredNumberOfTicks) {
    const [domainMin, domainMax] = yScale.domain();
    const stepValue = (domainMax - domainMin) / (preferredNumberOfTicks - 1);
    if (Number.isInteger(stepValue)) {
      yTicks = range(domainMin, domainMax + stepValue, stepValue);
      yGridLines = range(domainMin, domainMax + stepValue / 2, stepValue / 2);
    }
  }

  const getAnnotationAlignment = () => {
    // Keep the annotation's text from overflowing off the edges of the graph
    const annotationX = xScale(annotation.date);
    const [xMin, xMax] = xScale.range();
    const threshold = 25;
    const nearLeftEdge = xMin + threshold > annotationX;
    const nearRightEdge = xMax - threshold < annotationX;
    if (nearLeftEdge) {
      return "left";
    } else if (nearRightEdge) {
      return "right";
    }
    return "middle";
  };

  const [goodGlucoseMin, goodGlucoseMax] = GLUCOSE_LEVELS.goodRange;

  return (
    <svg
      width={width}
      height={height}
      style={{ fontFamily: theme.typography.fontFamily }}
    >
      <Group top={margin.top} left={margin.left}>
        {/* green reference area designating the good glucose level ranges */}
        <rect
          x="0"
          y={yScale(goodGlucoseMax)}
          width={xMax}
          height={yScale(goodGlucoseMin) - yScale(goodGlucoseMax)}
          style={{
            fill: "lime",
            fillOpacity: 0.06
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
        <GridColumns
          scale={xScale}
          height={yMax}
          stroke="rgba(255, 255, 255, 0.4)"
          tickValues={[entryDate, twoHoursLater]}
        />

        {/* the y-axis tracks the glucose level */}
        <AxisLeft
          scale={yScale}
          top={0}
          left={0}
          stroke={theme.palette.divider}
          tickValues={yTicks}
          tickStroke={theme.palette.divider}
          tickLabelProps={({ tick, index }) => ({
            dx: "-0.25em",
            dy: "0.25em",
            fill: theme.palette.text.secondary,
            fontSize: 12,
            textAnchor: "end"
          })}
        />

        {/* the x-axis tracks time */}
        <AxisBottom
          scale={xScale}
          top={yMax}
          stroke={theme.palette.divider}
          tickStroke={"rgba(255, 255, 255, 0.4)"}
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
            dy: "0.25em",
            fill: theme.palette.text.secondary,
            fontSize: 12,
            textAnchor: "middle"
          })}
        />

        {/* draw a line representing the glucose level */}
        <LinePath
          data={lineSeries}
          x={d => xScale(d.x)}
          y={d => yScale(d.y)}
          stroke={teal[300]}
          strokeWidth={2}
          curve={curveCatmullRom}
        />

        {/* shade any glucose increase above the baseline in teal */}
        <AreaClosed
          data={areaSeries}
          x={d => xScale(d.x)}
          y0={d => yScale(Math.min(d.y, baseline))}
          y1={d => yScale(d.y)}
          fill={teal[300]}
          fillOpacity={0.7}
        />

        {/* shade any glucose decrease below the baseline in red */}
        <AreaClosed
          data={areaSeries}
          x={d => xScale(d.x)}
          y0={d => yScale(d.y)}
          y1={d => yScale(Math.max(d.y, baseline))}
          fill={red[600]}
          fillOpacity={0.5}
        />

        {annotation && (
          <Group id="annotation-group" style={{ fontSize: 10 }}>
            <AnnotationLabel
              x={xScale(annotation.date)}
              y={yMax}
              ny={0}
              dx={0}
              color={amber[700]}
              connector={{ end: "dot" }}
              note={{
                label: truncate(annotation.description, { length: 40 }),
                align: getAnnotationAlignment(),
                orientation: "topBottom",
                padding: 10,
                wrap: 100
              }}
            />
          </Group>
        )}
      </Group>
    </svg>
  );
});

EntryGraph.propTypes = {
  entry: PropTypes.object.isRequired,
  subsequentEntry: PropTypes.object,
  bloodGlucoseLevels: PropTypes.array.isRequired,
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

export default withTheme()(EntryGraph);
