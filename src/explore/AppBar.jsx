import React, { memo } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const ExploreAppBar = ({ onClose }) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton color="inherit" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Explore</Typography>
      </Toolbar>
    </AppBar>
  );
};

ExploreAppBar.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default memo(ExploreAppBar);
