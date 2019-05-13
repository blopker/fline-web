import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";

const ButtonAppBar = ({ handleClose, title }) => (
  <AppBar position="sticky">
    <Toolbar>
      <IconButton color="inherit" onClick={handleClose} aria-label="Close">
        <CloseIcon />
      </IconButton>
      <Typography variant="h6">{title}</Typography>
    </Toolbar>
  </AppBar>
);

ButtonAppBar.propTypes = {
  handleClose: PropTypes.func.isRequired
};

export default ButtonAppBar;
