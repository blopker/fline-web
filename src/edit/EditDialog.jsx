import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "./AppBar";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";

import TimePicker from "./TimePicker";

const SlideUp = props => (
  <Slide unmountOnExit={true} direction="up" {...props} />
);

const styles = theme => ({
  subtitle: {
    textAlign: "center"
  },
  root: {
    flexGrow: 1,
    margin: "20px auto",
    padding: `0 ${theme.spacing.unit}px`,
    maxWidth: "500px"
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  textBox: {
    marginBottom: theme.spacing.unit,
    height: "100px"
  },
  timeBox: {
    marginTop: theme.spacing.unit * 2
  }
});

function getDefaultDate(selectedDate) {
  // Returns a new date where the day is the selectedDate,
  // but the time is the current time.
  const currentTime = new Date();
  const defaultDate = new Date(selectedDate);
  defaultDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
  return defaultDate;
}

function _EditScreen(props) {
  const { classes, isOpen, onClose, date, entry, saveEntry } = props;

  const [title, setTitle] = useState(
    entry ? "Edit something" : "Add something"
  );
  const [entryDescription, setEntryDescription] = useState(
    entry ? entry.description : ""
  );
  const [entryTime, setEntryTime] = useState(
    entry ? entry.date : getDefaultDate(date)
  );
  const [error, setError] = useState(false);

  // Reset the dialog state back to default values each time it is opened
  useEffect(() => {
    if (isOpen) {
      setTitle(entry ? "Edit something" : "Add something");
      setEntryDescription(entry ? entry.description : "");
      setEntryTime(entry ? entry.date : getDefaultDate(date));
      setError(false);
    }
  }, [isOpen, entry, date]);

  const submit = async e => {
    e.preventDefault();
    if (!entryDescription) {
      setError(true);
      return;
    }
    const editedEntry = {
      ...entry,
      description: entryDescription,
      date: entryTime,
      tags: []
    };
    await saveEntry(editedEntry);
    onClose();
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={SlideUp}
      data-testid="editDialog"
    >
      <AppBar title={title} onClose={onClose} />
      <div className={classes.root}>
        <form noValidate autoComplete="off" onSubmit={submit}>
          <Typography
            className={classes.paper}
            variant="subtitle1"
            gutterBottom
          >
            Add a meal, a feeling, a workout...
          </Typography>
          <TextField
            error={error}
            required
            id="entry-description"
            label="What happened?"
            multiline
            autoFocus={true}
            fullWidth={true}
            rowsMax="4"
            rows="4"
            className={classes.textBox}
            margin="normal"
            variant="filled"
            onChange={e => {
              if (e.target.value) {
                setError(false);
              }
              setEntryDescription(e.target.value);
            }}
            value={entryDescription}
          />
          <TimePicker
            className={classes.timeBox}
            time={entryTime}
            setTime={setEntryTime}
          />
          <Button
            className={classes.timeBox}
            variant="contained"
            color="primary"
            size="large"
            fullWidth={true}
            type="submit"
            aria-label="Save"
          >
            Save
          </Button>
        </form>
      </div>
    </Dialog>
  );
}

_EditScreen.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  saveEntry: PropTypes.func.isRequired,
  entry: PropTypes.object,
  date: PropTypes.object.isRequired
};

let EditScreen = withStyles(styles)(withRouter(_EditScreen));

export default EditScreen;
