import React, { memo } from "react";
import PropTypes from "prop-types";
import teal from "@material-ui/core/colors/teal";
import red from "@material-ui/core/colors/red";
import { withTheme } from "@material-ui/core/styles";
import { Group } from "@vx/group";
import { scaleTime, scaleLinear } from "@vx/scale";
import { LinePath, AreaClosed } from "@vx/shape";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Grid, GridColumns } from "@vx/grid";
import { curveCatmullRom } from "@vx/curve";
import { format, addHours, isWithinInterval } from "date-fns";
import Measure from "react-measure";
import NotEnoughDataMessage from "./NotEnoughDataMessage";

/**
 * Renders a graph of glucose levels for the following three hours after a food
 * log entry, and one hour prior.
 */

const EventGraph = props => {
  const { eventTime, data, theme } = props;

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

  // Bail out if there is not enough data within the 2hr time frame
  if (lineSeries.length < 2) {
    return <NotEnoughDataMessage />;
  }

  // Draw a graph that is sized to the viewport width
  return (
    <Measure bounds>
      {({ measureRef, contentRect }) => (
        <div ref={measureRef} style={{ height: 180, marginBottom: 16 }}>
          <Graph
            width={contentRect.bounds.width}
            height={contentRect.bounds.height}
            lineSeries={lineSeries}
            areaSeries={areaSeries}
            times={times}
            theme={theme}
          />
        </div>
      )}
    </Measure>
  );
};

/**
 * The Graph helper component does the SVG heavy lifting.
 */

const Graph = props => {
  const { width, height, lineSeries, areaSeries, theme } = props;

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
    top: 16,
    bottom: 32,
    left: 40,
    right: 24
  };

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

  return (
    <svg width={width} height={height}>
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
            fontFamily: theme.typography.fontFamily,
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
            fontFamily: theme.typography.fontFamily,
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
          fill={red[500]}
          fillOpacity={0.3}
        />
      </Group>
    </svg>
  );
};

EventGraph.propTypes = {
  data: PropTypes.object.isRequired,
  eventTime: PropTypes.object.isRequired,
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
