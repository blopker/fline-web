import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { differenceInSeconds } from "date-fns";
import flatten from "lodash/flatten";
import { withTheme } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";
import orange from "@material-ui/core/colors/orange";
import { Grid, GridColumns } from "@vx/grid";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { curveCatmullRom } from "@vx/curve";
import { Group } from "@vx/group";
import { scaleLinear } from "@vx/scale";
import ResponsiveWrapper from "../common/ResponsiveWrapper";
import { LOCALE_BLOOD_GLUCOSE_LEVELS as GLUCOSE_LEVELS } from "../constants";
import AnimatedLinePath from "../common/AnimatedLinePath";

const ResponsiveComparisonGraph = props => {
  return (
    <div style={{ width: "100%", height: "30vh", minHeight: 180 }}>
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

  // In order to compare LogEntries across different dates, we need to use a
  // uniform time scale. Zero out the entry date then consider only the number
  // of seconds elapsed since that entry date.
  const SECONDS_PER_HOUR = 60 * 60;
  const times = {
    entryDate: 0,
    oneHourEarlier: SECONDS_PER_HOUR * -1,
    oneHourLater: SECONDS_PER_HOUR,
    twoHoursLater: SECONDS_PER_HOUR * 2,
    threeHoursLater: SECONDS_PER_HOUR * 3
  };

  // Normalize the times of all of the entries under the current Tag by
  // slapping on an extra property tracking the elapsed number of seconds
  // since the LogEntry time for each of the blood glucose readings.
  const normalizedData = useMemo(() => {
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

  // From the list of checked entries, figure out what needs plotting.
  // Note that the checkedEntryIDs are not limited to the current set of entries
  // and IDs from previously explored Tags may be still be checked.
  const entryIdsToPlot = checkedEntryIds.filter(
    id => id in normalizedData && id !== highlightedEntryId
  );

  if (highlightedEntryId in normalizedData) {
    // The highlighted line should be added LAST to the list, it should be drawn
    // after all previously painted entries to mimic a higher z-index
    entryIdsToPlot.push(highlightedEntryId);
  }

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear({
    range: [0, xMax],
    domain: [times.oneHourEarlier, times.threeHoursLater]
  });

  const yExtent = useMemo(() => {
    const levels = flatten(Object.values(normalizedData)).map(lvl => lvl.level);
    const min = Math.min(...levels);
    const max = Math.max(...levels);
    return [min, max];
  }, [normalizedData]);

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [
      Math.min(GLUCOSE_LEVELS.croppedRange[0], yExtent[0]),
      Math.max(GLUCOSE_LEVELS.croppedRange[1], yExtent[1])
    ],
    clamp: true,
    nice: true
  });

  const [goodGlucoseMin, goodGlucoseMax] = GLUCOSE_LEVELS.goodRange;

  return (
    <svg
      width={width}
      height={height}
      style={{ fontFamily: theme.typography.fontFamily }}
      data-testid="comparisonGraph"
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
          numTicksRows={4}
          columnTickValues={Object.values(times)}
        />

        {/* redraw the event time and +2hr grid lines in a brighter color */}
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

        {/* the x-axis tracks time */}
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

        {/* animate a glucose line for each checked entry */}
        {entryIdsToPlot.map(entryId => (
          <AnimatedLinePath
            key={entryId}
            data={normalizedData[entryId]}
            data-testid={`path-${entryId}`}
            x={d => xScale(d.timeDelta)}
            y={d => yScale(d.level)}
            stroke={highlightedEntryId === entryId ? orange[500] : teal[300]}
            strokeWidth={highlightedEntryId === entryId ? 3 : 2}
            curve={curveCatmullRom}
          />
        ))}
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
