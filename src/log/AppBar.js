import React from "react";
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
    isOpen: false
  };
  constructor(props) {
    super(props);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onNextDate = this.onNextDate.bind(this);
    this.onLastDate = this.onLastDate.bind(this);
  }

  onDateChange(date) {
    this.props.setDate(state => {
      return date;
    });
    this.toggleCalendar();
  }

  onNextDate() {
    this.props.setDate(date => {
      var result = new Date(date);
      result.setDate(result.getDate() + 1);
      return result;
    });
  }

  onLastDate() {
    this.props.setDate(date => {
      var result = new Date(date);
      result.setDate(result.getDate() - 1);
      return result;
    });
  }

  toggleCalendar(e) {
    e && e.preventDefault();

    this.setState(state => {
      return { isOpen: !state.isOpen };
    });
  }

  render() {
    const { classes } = this.props;
    let d = this.props.date;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Fline
            </Typography>
            <div className={classes.grow}>
              <IconButton onClick={this.onLastDate} className={classes.inline}>
                <ArrowBack
                  className={`${classes.arrow} ${classes.arrowBack}`}
                />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                className={`${classes.inline} ${classes.date}`}
              >
                {`${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`}
              </Typography>
              <IconButton onClick={this.onNextDate} className={classes.inline}>
                <ArrowForward
                  className={`${classes.arrow} ${classes.arrowForward}`}
                />
              </IconButton>
            </div>
            <IconButton
              color="inherit"
              aria-label="Date"
              onClick={this.toggleCalendar}
            >
              <MenuIcon />
            </IconButton>

            <DayPicker
              isOpen={this.state.isOpen}
              onRequestClose={this.toggleCalendar}
              onDateChange={this.onDateChange}
              selectedDay={d}
            />
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
