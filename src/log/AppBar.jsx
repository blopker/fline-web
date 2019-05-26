import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/CalendarToday";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import ArrowForward from "@material-ui/icons/ArrowForwardIos";
import DayPicker from "./DayPicker";

const styles = theme => ({
  grow: {
    flexGrow: 1
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

function ButtonAppBar(props) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleCalendar(e) {
    e && e.preventDefault();

    setIsOpen(isOpen => {
      return !isOpen;
    });
  }

  function onDateChange(date) {
    props.setDate(date);
    toggleCalendar();
  }

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
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Fline
          </Typography>
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
            aria-label="Day Picker"
            onClick={toggleCalendar}
          >
            <MenuIcon />
          </IconButton>
          <DayPicker
            isOpen={isOpen}
            onRequestClose={toggleCalendar}
            onDateChange={onDateChange}
            selectedDay={d}
          />
        </Toolbar>
      </AppBar>
      <div className={classes.spacer} />
    </>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
