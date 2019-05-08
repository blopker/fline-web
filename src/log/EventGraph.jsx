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
import ResponsiveWrapper from "../ResponsiveWrapper";
import NotEnoughDataMessage from "./NotEnoughDataMessage";

/**
 * Renders a graph of glucose levels for the following three hours after a food
 * log entry, and one hour prior.
 */

const EventGraph = props => {
  const { event, day, theme } = props;

  const eventTime = event.get("time");
  const data = day.get("graph");
  const events = day.get("events");

  const times = {
    eventTime: eventTime,
    oneHourEarlier: addHours(eventTime, -1),
    oneHourLater: addHours(eventTime, 1),
    twoHoursLater: addHours(eventTime, 2),
    threeHoursLater: addHours(eventTime, 3)
  };

  const lineInterval = {
    start: times.oneHourEarlier,
    end: times.threeHoursLater
  };

  const areaInterval = {
    start: times.eventTime,
    end: times.twoHoursLater
  };

  const lineSeries = [];
  const areaSeries = [];

  data.toJS().forEach(d => {
    const x = new Date(d.x);
    const y = d.y;

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

  // Look for another event occurring around the same time window as the current
  // event. This other events will get annotated in the graph.
  const overlappingEvent = events.find(e => {
    return isWithinInterval(e.get("time"), lineInterval) && e !== event;
  });

  // Draw a graph that is sized to the viewport width
  return (
    <div style={{ height: 180, marginBottom: 16 }}>
      <ResponsiveWrapper>
        {({ width, height }) => (
          <Graph
            width={width}
            height={height}
            lineSeries={lineSeries}
            areaSeries={areaSeries}
            times={times}
            theme={theme}
            annotation={overlappingEvent ? overlappingEvent.toJS() : null}
          />
        )}
      </ResponsiveWrapper>
    </div>
  );
};

/**
 * The Graph helper component does the SVG heavy lifting.
 */

const Graph = props => {
  const { width, height, lineSeries, areaSeries, theme, annotation } = props;

  if (!(width && height)) {
    return null;
  }

  const {
    eventTime,
    oneHourEarlier,
    oneHourLater,
    twoHoursLater,
    threeHoursLater
  } = props.times;

  // The baseline is where the glucose level started off at the logged event
  // time. Any glucose increases/decrease from the baseline will be shaded in.
  const baseline = areaSeries[0].y;

  const margin = {
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 4,
    left: theme.spacing.unit * 5
  };

  if (annotation) {
    margin.top = theme.spacing.unit * 4;
  }

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleTime({
    range: [0, xMax],
    domain: [oneHourEarlier, threeHoursLater]
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [2, 10],
    clamp: true
  });

  const getAnnotationAlignment = () => {
    // Keep the annotation's text from overflowing off the edges of the graph
    const annotationX = xScale(new Date(annotation.time));
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
          y={yScale(6.9)}
          width={xMax}
          height={yScale(4) - yScale(6.9)}
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
            eventTime,
            oneHourLater,
            twoHoursLater,
            threeHoursLater
          ]}
          rowTickValues={[2, 4, 6, 8, 10]}
        />

        {/* redraw the event time and +2hr grid lines in a brighter color */}
        <GridColumns
          scale={xScale}
          height={yMax}
          stroke="rgba(255, 255, 255, 0.4)"
          tickValues={[eventTime, twoHoursLater]}
        />

        {/* the y-axis tracks the glucose level */}
        <AxisLeft
          scale={yScale}
          top={0}
          left={0}
          stroke={theme.palette.divider}
          tickStroke={theme.palette.divider}
          tickLabelProps={({ tick, index }) => ({
            dx: "-0.25em",
            dy: "0.25em",
            fill: theme.palette.text.secondary,
            fontSize: 12,
            textAnchor: "end"
          })}
          numTicks={5}
        />

        {/* the x-axis tracks time */}
        <AxisBottom
          scale={xScale}
          top={yMax}
          stroke={theme.palette.divider}
          tickStroke={"rgba(255, 255, 255, 0.4)"}
          tickValues={[eventTime, twoHoursLater]}
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
              x={xScale(new Date(annotation.time))}
              y={yMax}
              ny={0}
              dx={0}
              color={amber[700]}
              connector={{ end: "dot" }}
              note={{
                label: truncate(annotation.event, { length: 40 }),
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
};

EventGraph.propTypes = {
  day: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
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

export default withTheme()(memo(EventGraph));
