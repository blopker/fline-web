import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/CalendarToday";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(date) {
    this.setState({ startDate: date });
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
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Log
            </Typography>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              1/2/19
            </Typography>
            <IconButton
              color="inherit"
              aria-label="Date"
              onClick={this.toggleCalendar}
            >
              <MenuIcon />
            </IconButton>

            {this.state.isOpen && (
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                withPortal
                inline
              />
            )}
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
