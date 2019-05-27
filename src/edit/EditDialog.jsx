import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { ENTRY_TAGS } from "../constants";
import AppBar from "./AppBar";
import TimePicker from "./TimePicker";

const SlideUp = React.forwardRef((props, ref) => (
  <Slide ref={ref} direction="up" {...props} />
));

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: `${theme.spacing(3)}px auto`,
    padding: `0 ${theme.spacing(1)}px`,
    maxWidth: "500px"
  },
  chipsList: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(5),
    marginLeft: -theme.spacing(0.5),
    marginRight: -theme.spacing(0.5)
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  addTransparentBorder: {
    border: "solid 1px transparent"
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

function _EditDialog(props) {
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
  const [entryTag, setEntryTag] = useState(entry ? entry.tags[0] : null);
  const [error, setError] = useState(false);

  // Reset the dialog state back to default values each time it is opened
  useEffect(() => {
    if (isOpen) {
      setTitle(entry ? "Edit something" : "Add something");
      setEntryDescription(entry ? entry.description : "");
      setEntryTime(entry ? entry.date : getDefaultDate(date));
      setEntryTag(entry ? entry.tags[0] : null);
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
      tags: entryTag ? [entryTag] : []
    };
    await saveEntry(editedEntry);
    onClose();
  };

  const handleChipClick = e => {
    // Toggle the selected tag
    const newTag = e.currentTarget.textContent;
    if (!newTag) return;
    setEntryTag(prevTag => (prevTag === newTag ? null : newTag));
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
            color="textSecondary"
            align="center"
            variant="subtitle1"
            paragraph
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

          <div>
            <TimePicker time={entryTime} setTime={setEntryTime} />
          </div>

          <div className={classes.chipsList}>
            {ENTRY_TAGS.map(currentTag => {
              return (
                <Chip
                  key={currentTag}
                  label={currentTag}
                  aria-label={currentTag}
                  className={classes.chip}
                  onClick={handleChipClick}
                  variant={entryTag === currentTag ? "default" : "outlined"}
                  color={entryTag === currentTag ? "secondary" : "default"}
                  // Adding a transparent outline fixes some resize jitter when
                  // a chip switches variants after being clicked
                  classes={{ colorSecondary: classes.addTransparentBorder }}
                />
              );
            })}
          </div>

          <Button
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

_EditDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  saveEntry: PropTypes.func.isRequired,
  entry: PropTypes.object,
  date: PropTypes.object.isRequired
};

const EditDialog = withStyles(styles)(_EditDialog);

export default EditDialog;
