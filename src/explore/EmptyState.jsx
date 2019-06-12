import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const EmptyState = () => {
  return (
    <Box margin={7}>
      <Typography paragraph align="center">
        Nothing here yet!{" "}
        <span role="img" aria-label="Sun">
          ☀️
        </span>
      </Typography>
      <Typography paragraph align="center">
        When you log something that happened, try selecting a category, like
        “meal” or “feeling”.
      </Typography>
    </Box>
  );
};

export default EmptyState;
