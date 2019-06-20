import React, { useCallback, useState } from "react";
import Measure from "react-measure";

/**
 * Wraps a child component, computes the dimensions of its parent container,
 * and then passes those parents dimensions to the wrapped component via a
 * render prop.
 */

const ResponsiveWrapper = props => {
  const [dimensions, setDimensions] = useState({ width: -1, height: -1 });
  const { width, height } = dimensions;
  const onResize = useCallback(
    contentRect => setDimensions(contentRect.bounds),
    [setDimensions]
  );

  // There is a chicken and egg problem, we don't want to render the wrapped
  // component until we know its size, and we don't know its size until we've
  // rendered it. As a workaround, we can render a placeholder sizing guide div
  // that is styled to fill its parent's bounds. Once we have that div's
  // dimensions, we can render the actual wrapped component.
  const shouldRender = width > 0 && height > 0;

  return (
    <Measure bounds onResize={onResize}>
      {({ measureRef }) => (
        <div ref={measureRef} style={{ width: "100%", height: "100%" }}>
          {shouldRender && props.children({ width, height })}
        </div>
      )}
    </Measure>
  );
};

export default ResponsiveWrapper;
