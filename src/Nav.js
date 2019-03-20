import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import AssignmentIcon from "@material-ui/icons/Assignment";

const styles = {
  root: {
    width: "100%"
  },
  stickToBottom: {
    width: "100%",
    position: "fixed",
    bottom: 0
  }
};

class SimpleBottomNavigation extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={`${classes.root} ${classes.stickToBottom}`}
      >
        <BottomNavigationAction label="Log" icon={<AssignmentIcon />} />
        <BottomNavigationAction label="Results" icon={<ShowChartIcon />} />
      </BottomNavigation>
    );
  }
}

SimpleBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleBottomNavigation);
