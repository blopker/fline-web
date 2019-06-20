import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { LinePath } from "@vx/shape";
import { useSpring, animated } from "react-spring";

/**
 * @vx/LinePath that is animated to look like it's drawing itself
 *
 * https://css-tricks.com/svg-line-animation-works/
 *
 * Set the LinePath to be a dashed line
 * Set the dash size so large that it completely covers the length of the line
 * Animate the offset position of the dash from 100% to 0% of the line length
 *
 */

const AnimatedLinePath = props => {
  const {
    x,
    y,
    curve,
    data,
    fill = "transparent",
    stroke,
    ...restProps
  } = props;

  // Use spring in imperative mode by passing a function instead of an object
  // This allows tighter control over when the animation starts
  const [animationValues, updateAnimation] = useSpring(() => ({}));

  // In order to animate the line path, we need to know how long it is
  const [lineLength, setLineLength] = useState(null);
  const pathRef = useCallback(
    node => {
      if (node !== null) {
        const length = node.getTotalLength();
        setLineLength(length);
        updateAnimation({
          from: { dashOffset: length },
          to: { dashOffset: 0 }
        });
      }
    },
    [updateAnimation]
  );

  return (
    <LinePath x={x} y={y} curve={curve}>
      {({ path }) => {
        return (
          <animated.path
            ref={pathRef}
            stroke={lineLength ? stroke : "none"}
            strokeDasharray={lineLength}
            strokeDashoffset={animationValues.dashOffset}
            d={path(data)}
            fill={fill}
            {...restProps}
          />
        );
      }}
    </LinePath>
  );
};

AnimatedLinePath.propTypes = {
  curve: PropTypes.func,
  data: PropTypes.array,
  fill: PropTypes.string,
  x: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  y: PropTypes.oneOfType([PropTypes.func, PropTypes.number])
};

export default AnimatedLinePath;
