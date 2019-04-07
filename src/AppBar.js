import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/CalendarToday";
import DayPicker from "./DayPicker";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  }
};

class ButtonAppBar extends React.Component {
  state = {
    value: 0,
    isOpen: false
  };
  constructor(props) {
    super(props);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.props.setDate(state => {
      return date;
    });
    this.toggleCalendar();
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
              Log
            </Typography>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {`${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`}
            </Typography>
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
