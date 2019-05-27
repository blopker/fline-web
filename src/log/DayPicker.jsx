import React from "react";
import Modal from "@material-ui/core/Modal";
import { withStyles } from "@material-ui/core/styles";

import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`
  };
}

const styles = theme => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none"
  }
});

function MyPicker(props) {
  return (
    <Modal
      data-testid="dayPicker"
      open={props.isOpen}
      onClose={props.onRequestClose}
      disablePortal={true}
    >
      <div style={getModalStyle()} className={props.classes.paper}>
        <DayPicker
          onDayClick={props.onDateChange}
          selectedDays={props.selectedDay}
        />
      </div>
    </Modal>
  );
}

const MyPickerWrapped = withStyles(styles)(MyPicker);
export default MyPickerWrapped;
