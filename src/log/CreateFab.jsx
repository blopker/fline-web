import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import curlArrow from "./curlyArrow.png";

const styles = theme => ({
  fab: {
    margin: theme.spacing(2),
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "300px",
    height: "200px"
  },
  fabButton: {
    position: "absolute",
    bottom: 0,
    right: 0
  }
});

const instructionStyles = theme => ({
  text: {
    textAlign: "center",
    position: "relative",
    top: "17px",
    left: "10px"
  },
  arrow: {
    width: "100px",
    position: "relative",
    left: "129px",
    transform: "rotate(8deg)",
    top: "27px"
  },
  main: {
    position: "absolute"
  }
});

function _IntroFabInstructions(props) {
  return (
    <div className={props.classes.main}>
      <Typography className={props.classes.text} variant="body1" gutterBottom>
        Add a meal, a drink,<br />
        a feeling, a workout...
      </Typography>
      <img className={props.classes.arrow} src={curlArrow} alt="" />
    </div>
  );
}

let IntroFabInstructions = withStyles(instructionStyles)(_IntroFabInstructions);

function _FloatingEditButton(props) {
  const { classes } = props;
  const LogEditLink = React.forwardRef((props, ref) => (
    <Link innerRef={ref} to="/log/edit/" {...props} />
  ));
  return (
    <div className={classes.fab}>
      {props.initialState === true && <IntroFabInstructions />}
      <Fab
        className={classes.fabButton}
        color="primary"
        aria-label="Create Entry"
        component={LogEditLink}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}

let FloatingEditButton = withStyles(styles)(_FloatingEditButton);

export default FloatingEditButton;
