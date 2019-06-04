import React from "react";
import PropTypes from "prop-types";

import { withTheme } from "@material-ui/core/styles";
import { format } from "date-fns";
import { Grid, GridColumns } from "@vx/grid";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { LinePath } from "@vx/shape";
import { curveCatmullRom } from "@vx/curve";
import teal from "@material-ui/core/colors/teal";
import orange from "@material-ui/core/colors/orange";
import { Group } from "@vx/group";
import { scaleLinear, scaleTime } from "@vx/scale";
import { LOCALE_BLOOD_GLUCOSE_LEVELS as GLUCOSE_LEVELS } from "../constants";
import ResponsiveWrapper from "../ResponsiveWrapper";

const ResponsiveComparisonGraph = props => {
  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveWrapper>
        {({ width, height }) => (
          <ComparisonGraph width={width} height={height} {...props} />
        )}
      </ResponsiveWrapper>
    </div>
  );
};

const ComparisonGraph = props => {
  const {
    width,
    height,
    series,
    theme,
    highlightedEntryId,
    selectedTag
  } = props;
  if (!(width && height)) {
    return null;
  }

  const margin = {
    top: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(4),
    left: theme.spacing(4)
  };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear({
    range: [0, xMax],
    domain: [-60 * 60, 60 * 60 * 3]
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: GLUCOSE_LEVELS.range,
    clamp: true,
    nice: true
  });

  const [goodGlucoseMin, goodGlucoseMax] = GLUCOSE_LEVELS.goodRange;
  const { [highlightedEntryId]: orangeSeries, ...tealSeries } = series;

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
          // numTicksRows={8}
          // numTicksColumns={4}
        />

        <GridColumns
          scale={xScale}
          height={yMax}
          stroke="rgba(255, 255, 255, 0.4)"
          tickValues={[0, 60 * 60 * 2]}
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

        <AxisBottom
          scale={xScale}
          top={yMax}
          stroke={theme.palette.divider}
          tickStroke={"rgba(255, 255, 255, 0.4)"}
          tickValues={[0, 60 * 60 * 2]}
          tickFormat={x => {
            if (x === 0) {
              return selectedTag;
            } else {
              return "+2 hours";
            }
          }}
          tickLabelProps={({ tick, index }) => ({
            dy: "0.25em",
            fill: theme.palette.text.secondary,
            fontSize: 12,
            textAnchor: "middle"
          })}
        />

        {tealSeries &&
          Object.entries(tealSeries).map(([entryId, data]) => (
            <LinePath
              key={entryId}
              data={data}
              x={d => xScale(d.entryTimeDelta)}
              y={d => yScale(d.level)}
              stroke={teal[300]}
              strokeWidth={2}
              curve={curveCatmullRom}
            />
          ))}

        {/* The highlighted entry is painted last, on top of the other lines */}
        {orangeSeries && (
          <LinePath
            key={highlightedEntryId}
            data={orangeSeries}
            x={d => xScale(d.entryTimeDelta)}
            y={d => yScale(d.level)}
            stroke={orange[500]}
            strokeWidth={3}
            curve={curveCatmullRom}
          />
        )}
      </Group>
    </svg>
  );
};

ComparisonGraph.propTypes = {
  selectedTag: PropTypes.string.isRequired,
  series: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  highlightedEntryId: PropTypes.number
};

export default withTheme(ResponsiveComparisonGraph);
