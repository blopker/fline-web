import React, { memo } from "react";
import PropTypes from "prop-types";
import { withTheme } from "@material-ui/core/styles";
import { ResponsiveLine } from "@nivo/line";
import { format, startOfDay, addDays } from "date-fns";

/**
 * Renders a graph of glucose levels for a single day.
 *
 * The graph size grows to fill its parent container's dimensions. Make sure the
 * parent container has an explicitly defined height, otherwise the graph height
 * will be 0px.
 */

const Graph = memo(props => {
  const { theme } = props;

  // DANGER: Nivo messes up xScale min/max values and timezone info if you
  // use its built-in date formatting options. It's much safer to parse any
  // dates manually ourself.
  const data = props.data.toJS().map(({ x, y }) => ({ x: new Date(x), y }));
  const xMin = startOfDay(data[0].x);
  const xMax = addDays(xMin, 1);

  // Indicate the good range of glucose levels with a green background
  const GoodGlucoseRange = ({ computedData, xScale, yScale }) => {
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
          data
        }
      ]}
      xScale={{
        type: "time",
        precision: "second",
        // Use native JS Date objects rather providing any formatting string.
        // Nivo's string to date formatting seems buggy as of v0.56.2.
        format: "native",
        min: xMin,
        max: xMax
      }}
      axisBottom={{
        format: x => format(x, "ha").toLowerCase()
      }}
      yScale={{
        type: "linear",
        min: 0,
        max: 21
      }}
      axisLeft={{
        tickValues: [3, 6, 9, 12, 15, 18, 21]
      }}
      gridYValues={[3, 6, 9, 12, 15, 18, 21]}
      margin={{
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
        bottom: theme.spacing.unit * 4,
        left: theme.spacing.unit * 3
      }}
    />
  );
});

Graph.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default withTheme()(Graph);
