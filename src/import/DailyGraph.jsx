import React, { memo } from "react";
import PropTypes from "prop-types";
import { withTheme } from "@material-ui/core/styles";
import { format, startOfDay, addDays } from "date-fns";
import { Grid } from "@vx/grid";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { LinePath } from "@vx/shape";
import { curveCatmullRom } from "@vx/curve";
import teal from "@material-ui/core/colors/teal";
import { Group } from "@vx/group";
import { scaleLinear, scaleTime } from "@vx/scale";
import { LOCALE_BLOOD_GLUCOSE_LEVELS as GLUCOSE_LEVELS } from "../constants";

/**
 * Renders a graph of glucose levels for a single day.
 */

const DailyGraph = memo(props => {
  const { theme, width, height, data } = props;

  const startTime = startOfDay(data[0].date);
  const endTime = addDays(startTime, 1);

  const margin = {
    top: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(4),
    left: theme.spacing(4)
  };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleTime({
    range: [0, xMax],
    domain: [startTime, endTime]
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: GLUCOSE_LEVELS.range,
    clamp: true,
    nice: true
  });

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
          numTicksRows={8}
        />

        {/* the y-axis tracks the glucose level */}
        <AxisLeft
          scale={yScale}
          top={0}
          left={0}
          stroke={theme.palette.divider}
          tickStroke={theme.palette.divider}
          hideZero
          numTicks={4}
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
          tickStroke={theme.palette.divider}
          tickFormat={x =>
            format(x, "h:mma")
              .toLowerCase()
              .replace(":00", "")
          }
          tickLabelProps={({ tick, index }) => ({
            dy: "0.25em",
            fill: theme.palette.text.secondary,
            fontSize: 12,
            textAnchor: "middle"
          })}
        />

        {/* draw a line representing the glucose level */}
        <LinePath
          data={data}
          x={d => xScale(d.date)}
          y={d => yScale(d.level)}
          stroke={teal[300]}
          strokeWidth={2}
          curve={curveCatmullRom}
        />
      </Group>
    </svg>
  );
});

DailyGraph.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default withTheme(DailyGraph);
