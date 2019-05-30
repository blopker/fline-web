import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import ArrowForward from "@material-ui/icons/ArrowForwardIos";
import ExploreIcon from "@material-ui/icons/Explore";

const styles = theme => ({
  grow: {
    flexGrow: 1,
    textAlign: "center"
  },
  inline: {
    display: "inline-block"
  },
  date: {
    top: "3px",
    position: "relative"
  },
  spacer: theme.mixins.toolbar
});

const ExploreLink = React.forwardRef((props, ref) => (
  <Link to="/log/explore" innerRef={ref} {...props} />
));

function ButtonAppBar(props) {
  function onNextDate() {
    props.setDate(date => {
      var result = new Date(date);
      result.setDate(result.getDate() + 1);
      return result;
    });
  }

  function onLastDate() {
    props.setDate(date => {
      var result = new Date(date);
      result.setDate(result.getDate() - 1);
      return result;
    });
  }

  const { classes } = props;
  let d = props.date;
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {props.menu}
          <div className={classes.grow}>
            <IconButton
              onClick={onLastDate}
              className={classes.inline}
              aria-label="Previous Date"
            >
              <ArrowBack className={`${classes.arrow} ${classes.arrowBack}`} />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              className={`${classes.inline} ${classes.date}`}
            >
              {d.toLocaleDateString("en-US")}
            </Typography>
            <IconButton
              onClick={onNextDate}
              className={classes.inline}
              aria-label="Next Date"
            >
              <ArrowForward
                className={`${classes.arrow} ${classes.arrowForward}`}
              />
            </IconButton>
          </div>
          <IconButton
            color="inherit"
            aria-label="Explore"
            component={ExploreLink}
          >
            <ExploreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.spacer} />
    </>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  menu: PropTypes.element.isRequired,
  setDate: PropTypes.func.isRequired
};

export default withStyles(styles)(ButtonAppBar);
