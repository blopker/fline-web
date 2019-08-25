import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import SafariShareIcon from "./SafariShareIcon";

const useStyles = makeStyles(theme => ({
  positionGuide: {
    position: "fixed",
    bottom: 0,
    width: 1,
    left: "50%",
    right: "50%"
  },

  tooltip: {
    position: "relative",
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: theme.typography.fontSize,
    padding: theme.spacing(1.5),
    lineHeight: 1.5
  },

  arrow: {
    position: "absolute",
    fontSize: 6,
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid"
    }
  },

  popper: {
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: "-0.95em",
      width: "2em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${theme.palette.common.white} transparent transparent transparent`
      }
    }
  }
}));

const MobileSafariBalloon = props => {
  const { positionGuide, arrow, ...classes } = useStyles();
  const [arrowRef, setArrowRef] = React.useState(null);

  return (
    <Tooltip
      open
      classes={classes}
      PopperProps={{
        popperOptions: {
          modifiers: {
            arrow: {
              enabled: Boolean(arrowRef),
              element: arrowRef
            }
          }
        }
      }}
      {...props}
      title={
        <React.Fragment>
          First, you need our app: Please tap{" "}
          <SafariShareIcon style={{ verticalAlign: "text-bottom" }} /> and{" "}
          <strong>Add to Home Screen</strong>.
          <span className={arrow} ref={setArrowRef} />
        </React.Fragment>
      }
    >
      <div className={positionGuide}></div>
    </Tooltip>
  );
};

export default MobileSafariBalloon;
