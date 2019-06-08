import React, { memo } from "react";
import PropTypes from "prop-types";
import { LinePath } from "@vx/shape";
import { Spring, animated } from "react-spring/renderprops";

/**
 * @vx/LinePath that is animated to look like it's drawing itself
 *
 * https://css-tricks.com/svg-line-animation-works/
 *
 * Set the LinePath to be a dashed line
 * Set the dash size so large that it completely covers the length of the line
 * Animate the offset position of the dash
 *
 */

const AnimatedLinePath = props => {
  const { x, y, curve, data, fill = "transparent", ...restProps } = props;

  return (
    <Spring native from={{ offset: 100 }} to={{ offset: 0 }}>
      {({ offset }) => {
        return (
          <LinePath x={x} y={y} curve={curve}>
            {({ path }) => {
              return (
                <animated.path
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={offset}
                  d={path(data)}
                  fill={fill}
                  {...restProps}
                />
              );
            }}
          </LinePath>
        );
      }}
    </Spring>
  );
};

AnimatedLinePath.propTypes = {
  curve: PropTypes.func,
  data: PropTypes.array,
  fill: PropTypes.string,
  x: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  y: PropTypes.oneOfType([PropTypes.func, PropTypes.number])
};

export default memo(AnimatedLinePath);
