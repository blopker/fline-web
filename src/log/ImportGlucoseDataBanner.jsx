import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import teal from "@material-ui/core/colors/teal";
import crescentMoon from "./crescentMoon.png";
import CheckIcon from "@material-ui/icons/Check";

const styles = theme => ({
  banner: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  orangeBanner: {
    backgroundColor: orange[200],
    color: theme.palette.grey["A400"]
  },
  tealBanner: {
    backgroundColor: teal[500],
    color: theme.palette.common.white
  },
  text: {
    color: "inherit"
  },
  moonIcon: {
    height: 32,
    marginRight: theme.spacing(2)
  },
  checkIcon: {
    fontSize: 32,
    marginRight: theme.spacing(2)
  }
});

/**
 * Show a banner on the Log screen encouraging the user to upload their glucose
 * data. Clicking on the banner brings up the ImportDialog.
 */
const ImportGlucoseDataBanner = props => {
  const { classes, hasImportedAlready } = props;

  let colorClassName, image, copy;
  if (hasImportedAlready) {
    image = <CheckIcon className={classes.checkIcon} />;
    copy = "Glucose data added";
    colorClassName = classes.tealBanner;
  } else {
    image = <img className={classes.moonIcon} src={crescentMoon} alt="moon" />;
    copy = "Tap here to create your glucose curves";
    colorClassName = classes.orangeBanner;
  }

  const LogImportLink = React.forwardRef((props, ref) => (
    <Link innerRef={ref} to={"/log/import"} {...props} />
  ));

  return (
    <>
      <ButtonBase
        className={`${classes.banner} ${colorClassName}`}
        focusRipple
        component={LogImportLink}
      >
        {image}
        <Typography variant="subtitle2" className={classes.text}>
          {copy}
        </Typography>
      </ButtonBase>
    </>
  );
};

ImportGlucoseDataBanner.propTypes = {
  classes: PropTypes.object.isRequired,
  hasImportedAlready: PropTypes.bool
};

export default withStyles(styles)(ImportGlucoseDataBanner);
