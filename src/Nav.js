import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

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
    value: 0,
    pathMap: ["/", "/results"]
  };

  static getDerivedStateFromProps(newProps, state) {
    const { pathname } = newProps.location;
    const { pathMap } = state;
    const value = pathMap.indexOf(pathname);

    if (value > -1) {
      return { value };
    }
    return null;
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value, pathMap } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={`${classes.root} ${classes.stickToBottom}`}
      >
        <BottomNavigationAction
          component={Link}
          to={pathMap[0]}
          label="Log"
          icon={<AssignmentIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={pathMap[1]}
          label="Results"
          icon={<ShowChartIcon />}
        />
      </BottomNavigation>
    );
  }
}

SimpleBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(SimpleBottomNavigation));
