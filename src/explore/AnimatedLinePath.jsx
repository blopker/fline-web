import React, { memo } from "react";

import { LinePath } from "@vx/shape";
import { Spring, config } from "react-spring/renderprops";

const AnimatedLinePath = props => {
  return (
    <Spring from={{ offset: 100 }} to={{ offset: 0 }}>
      {({ offset }) => {
        return (
          <LinePath
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={offset}
            {...props}
          />
        );
      }}
    </Spring>
  );
};

export default memo(AnimatedLinePath);
