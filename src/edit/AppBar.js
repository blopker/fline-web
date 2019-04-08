import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  inline: {
    display: "inline-block"
  },
  date: {
    top: "3px",
    position: "relative"
  }
};

class ButtonAppBar extends React.Component {
  state = {
    value: 0,
    isOpen: false
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    let d = this.props.date;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Edit
            </Typography>
            <Link
              to="/"
              replace
              style={{ textDecoration: "none", color: "white" }}
            >
              <IconButton color="inherit" aria-label="Date">
                <CloseIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
