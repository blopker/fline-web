import React, { memo } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { ResponsiveLine } from "@nivo/line";
import { format, addHours } from "date-fns";
import NotEnoughDataMessage from "./NotEnoughDataMessage";

/**
 * Renders a graph of glucose levels for the following two hours after a food
 * log entry.
 */

const styles = theme => ({
  container: {
    height: 180,
    margin: `0 ${theme.spacing.unit * 4}px ${theme.spacing.unit}px`
  }
});

const EventGraph = memo(props => {
  const { theme, eventTime, data, classes } = props;

  const twoHoursLater = addHours(eventTime, 2);
  const isWithinTimeRange = x => {
    return x >= eventTime && x <= twoHoursLater;
  };

  // props.data contains an entire day's worth of info, filter that down to
  // find only the data points up to 2 hours after the event time
  const filteredData = data.toJS().reduce((accumulator, currentValue) => {
    const x = new Date(currentValue.x);
    const y = currentValue.y;
    if (isWithinTimeRange(x)) {
      accumulator.push({ x, y });
    }
    return accumulator;
  }, []);

  // Bail out if there is not enough data within the 2hr time frame
  if (filteredData.length < 2) {
    return <NotEnoughDataMessage />;
  }

  // Indicate the good range of glucose levels with a green background
  const GoodGlucoseRange = ({ computedData, xScale, yScale }) => {
    const [xMin, xMax] = xScale.domain();
    return (
      <rect
        x={xScale(xMin)}
        y={yScale(6.9)}
        width={xScale(xMax)}
        height={yScale(4) - yScale(6.9)}
        fill="rgba(0, 255, 0, 0.12)"
      />
    );
  };

  // Base the graphs colors off of the current Material-UI theme
  const graphTheme = {
    background: "transparent",
    textColor: theme.palette.text.secondary,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily,
    axis: {
      domain: {
        line: { stroke: theme.palette.divider, strokeWidth: 1 }
      },
      ticks: {
        line: { stroke: theme.palette.divider, strokeWidth: 1 }
      }
    },
    grid: {
      line: { stroke: theme.palette.divider, strokeWidth: 1 }
    }
  };

  return (
    <Paper className={classes.container} elevation={0}>
      <ResponsiveLine
        theme={graphTheme}
        colors="#5AC0C0"
        enableDots={false}
        isInteractive={false}
        layers={[
          "grid",
          "markers",
          "axes",
          "areas",
          "lines",
          "slices",
          "dots",
          "legends",
          GoodGlucoseRange
        ]}
        data={[
          {
            id: "glucose series",
            data: filteredData
          }
        ]}
        xScale={{
          type: "time",
          precision: "second",
          // Use native JS Date objects rather providing any formatting string.
          // Nivo's string to date formatting seems buggy as of v0.56.2.
          format: "native"
        }}
        axisBottom={{
          tickValues: 4,
          format: x =>
            format(x, "h:mma")
              .toLowerCase()
              .replace(":00", "")
        }}
        yScale={{
          type: "linear",
          min: 2,
          max: 10
        }}
        gridYValues={[2, 3, 4, 5, 6, 7, 8, 9, 10]}
        axisLeft={{
          tickValues: [2, 4, 6, 8, 10]
        }}
        margin={{
          top: theme.spacing.unit * 2,
          right: theme.spacing.unit * 2,
          bottom: theme.spacing.unit * 4,
          left: theme.spacing.unit * 3
        }}
      />
    </Paper>
  );
});

EventGraph.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  eventTime: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EventGraph);
