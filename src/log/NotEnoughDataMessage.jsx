import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    margin: `0 ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    backgroundColor: orange[200],
    color: theme.palette.grey["A400"]
  }
});

/**
 * This message component is displayed in place of an EventGraph whenever an
 * event in the log doesn't have sufficient enough imported data to generate a
 * plot.
 */

const NotEnoughDataMessage = ({ classes }) => (
  <Paper className={classes.root}>
    <Typography variant="caption" color="inherit" align="center">
      Chart Unavailable - Not Enough Data{" "}
      <span role="img" aria-label="disappointed">
        😟
      </span>
    </Typography>
  </Paper>
);

NotEnoughDataMessage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NotEnoughDataMessage);
