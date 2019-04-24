import React, { useState } from "react";
import PropTypes from "prop-types";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import teal from "@material-ui/core/colors/teal";
import crescentMoon from "./crescentMoon.png";
import ImportDialog from "./../import/ImportDialog";
import CheckIcon from "@material-ui/icons/Check";

const styles = theme => ({
  banner: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
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
    marginRight: theme.spacing.unit * 2
  },
  checkIcon: {
    fontSize: 32,
    marginRight: theme.spacing.unit * 2
  }
});

/**
 * Show a banner on the Log screen encouraging the user to upload their glucose
 * data. Clicking on the banner brings up the ImportDialog.
 */
const ImportGlucoseDataBanner = props => {
  const { classes, day } = props;
  const dataExists = day.get("graph").size > 0;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  let colorClassName, image, copy;
  if (dataExists) {
    image = <CheckIcon className={classes.checkIcon} />;
    copy = "Glucose data imported";
    colorClassName = classes.tealBanner;
  } else {
    image = <img className={classes.moonIcon} src={crescentMoon} alt="moon" />;
    copy = "At the end of the day, add your glucose data";
    colorClassName = classes.orangeBanner;
  }

  return (
    <>
      <ButtonBase
        className={`${classes.banner} ${colorClassName}`}
        onClick={handleOpen}
        focusRipple
      >
        {image}
        <Typography variant="subtitle2" className={classes.text}>
          {copy}
        </Typography>
      </ButtonBase>
      <ImportDialog
        isOpen={isDialogOpen}
        handleClose={handleClose}
        day={day}
      />
    </>
  );
};

ImportGlucoseDataBanner.propTypes = {
  day: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImportGlucoseDataBanner);
