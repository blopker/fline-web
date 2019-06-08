import React, { memo } from "react";

import { LinePath } from "@vx/shape";
import { Spring, animated } from "react-spring/renderprops";

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

export default memo(AnimatedLinePath);
