import React from "react";
import PropTypes from "prop-types";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import crescentMoon from "./crescentMoon.png";

const styles = theme => ({
  banner: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    backgroundColor: orange[200],
    display: "flex",
    alignItems: "center",
    width: "100%"
  },

  text: {
    color: theme.palette.grey["A400"]
  },

  moonIcon: {
    height: 32,
    marginRight: theme.spacing.unit * 2
  }
});

const ImportGlucoseDataBanner = props => {
  const { classes } = props;

  return (
    <ButtonBase
      className={classes.banner}
      onClick={e => console.log("clicked")}
      focusRipple
    >
      <img className={classes.moonIcon} src={crescentMoon} alt="moon" />
      <Typography variant="subtitle2" className={classes.text}>
        At the end of the day, add your glucose data
      </Typography>
    </ButtonBase>
  );
};

ImportGlucoseDataBanner.propTypes = {
  date: PropTypes.object.isRequired
};

export default withStyles(styles)(ImportGlucoseDataBanner);
