import React, { useState } from "react";
import AppBar from "./AppBar";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";

import TimePicker from "./TimePicker";

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
    marginBotttom: theme.spacing.unit,
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
  defaultDate.setHours(currentTime.getHours());
  defaultDate.setMinutes(currentTime.getMinutes());
  return defaultDate;
}

function _EditScreen(props) {
  const { classes } = props;
  const title = props.event ? "Edit something" : "Add something";

  const defaultDescription = props.event ? props.event.get("event") : "";
  let [eventDescription, setEventDescription] = useState(defaultDescription);
  const defaultTime = props.event
    ? props.event.get("time")
    : getDefaultDate(props.date);

  let [eventTime, setEventTime] = useState(defaultTime);

  let [error, setError] = useState(false);
  let submit = e => {
    e.preventDefault();
    if (!eventDescription) {
      setError(true);
      return;
    }
    async function doit() {
      await props.addEvent(
        {
          event: eventDescription,
          time: eventTime.toLocaleString()
        },
        props.eventID
      );
      props.history.replace("/");
    }
    doit();
  };

  return (
    <>
      <AppBar title={title} />
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
            id="event-description"
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
              setEventDescription(e.target.value);
            }}
            value={eventDescription}
          />
          <TimePicker
            className={classes.timeBox}
            time={eventTime}
            setTime={setEventTime}
          />
          <Button
            className={classes.timeBox}
            variant="contained"
            color="primary"
            size="large"
            fullWidth={true}
            type="submit"
          >
            Save
          </Button>
        </form>
      </div>
    </>
  );
}

let EditScreen = withStyles(styles)(withRouter(_EditScreen));

export default EditScreen;
