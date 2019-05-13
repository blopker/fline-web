import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import curlArrow from "./curlyArrow.png";
import EditDialog from "../edit/EditDialog";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit * 2,
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
        Log what happened today - a meal, <br />
        a feeling, a workout, anything <br />
        goes.
      </Typography>
      <img className={props.classes.arrow} src={curlArrow} alt="" />
    </div>
  );
}

let IntroFabInstructions = withStyles(instructionStyles)(_IntroFabInstructions);

function _FloatingEditButton(props) {
  const { classes, date, addEvent } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={classes.fab}>
      {props.initialState === true && <IntroFabInstructions />}
      <Fab
        className={classes.fabButton}
        color="primary"
        aria-label="Edit"
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      {isDialogOpen && (
        <EditDialog
          isOpen={isDialogOpen}
          handleClose={handleClose}
          date={date}
          addEvent={addEvent}
        />
      )}
    </div>
  );
}

let FloatingEditButton = withStyles(styles)(_FloatingEditButton);

export default FloatingEditButton;
