import React, { useMemo } from "react";
import PropTypes from "prop-types";
import pick from "lodash/pick";
import omit from "lodash/omit";
import { differenceInSeconds } from "date-fns";
import { withTheme } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";
import orange from "@material-ui/core/colors/orange";
import { Grid, GridColumns } from "@vx/grid";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { LinePath } from "@vx/shape";
import { curveCatmullRom } from "@vx/curve";
import { Group } from "@vx/group";
import { scaleLinear } from "@vx/scale";

import AnimatedLinePath from "./AnimatedLinePath";

import ResponsiveWrapper from "../ResponsiveWrapper";
import { LOCALE_BLOOD_GLUCOSE_LEVELS as GLUCOSE_LEVELS } from "../constants";

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
    entries,
    theme,
    highlightedEntryId,
    selectedTag,
    checkedEntryIds
  } = props;

  const margin = {
    top: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(4),
    left: theme.spacing(5)
  };

  const SECONDS_PER_HOUR = 60 * 60;

  const times = {
    entryDate: 0,
    oneHourEarlier: SECONDS_PER_HOUR * -1,
    oneHourLater: SECONDS_PER_HOUR,
    twoHoursLater: SECONDS_PER_HOUR * 2,
    threeHoursLater: SECONDS_PER_HOUR * 3
  };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear({
    range: [0, xMax],
    domain: [times.oneHourEarlier, times.threeHoursLater]
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: GLUCOSE_LEVELS.range,
    clamp: true
  });

  const [goodGlucoseMin, goodGlucoseMax] = GLUCOSE_LEVELS.goodRange;

  // Tack on an extra property tracking the elapsed number of seconds
  // since the LogEntry time for each of the blood glucose readings
  const series = useMemo(() => {
    const result = {};
    entries.forEach(entry => {
      const baseLine = entry.bloodGlucoseLevels.find(
        lvl => lvl.date >= entry.date
      );
      result[entry.id] = entry.bloodGlucoseLevels.map(lvl => ({
        ...lvl,
        timeDelta: differenceInSeconds(lvl.date, entry.date),
        levelDelta: lvl.level - baseLine
      }));
    });
    return result;
  }, [entries]);

  const orangeSeries = series[highlightedEntryId];
  let tealSeries = pick(series, checkedEntryIds);
  tealSeries = omit(tealSeries, highlightedEntryId);

  // const tealSeries = pickBy(series, (value, id) => {
  //   debugger;
  //   return checkedEntryIds.includes(id) && id !== highlightedEntryId;
  // });

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
          numTicksRows={5}
          columnTickValues={Object.values(times)}
        />

        <GridColumns
          scale={xScale}
          height={yMax}
          stroke="rgba(255, 255, 255, 0.4)"
          tickValues={[times.entryDate, times.twoHoursLater]}
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
          tickValues={[times.entryDate, times.twoHoursLater]}
          tickFormat={x => {
            if (x === times.entryDate) {
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
            <AnimatedLinePath
              key={entryId}
              data={data}
              x={d => xScale(d.timeDelta)}
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
            x={d => xScale(d.timeDelta)}
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
  entries: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  checkedEntryIds: PropTypes.array,
  highlightedEntryId: PropTypes.number
};

export default withTheme(ResponsiveComparisonGraph);
