import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import Instructions from "./Instructions";
import AppBar from "./AppBar";
import process from "../digitizer";
import SuccessScreen from "./SuccessScreen";
import TealButton from "./TealButton";

const SlideUp = props => <Slide direction="up" {...props} />;

const styles = theme => ({
  section: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    textAlign: "center"
  },
  paragraph: {
    margin: `${theme.spacing.unit * 3}px 0`
  }
});

const HIDDEN_INPUT_FIELD_ID = "select-image-file-input";

const fileChangedHandler = async (event, addGraph) => {
  const { files } = event.target;
  if (!files.length) {
    return;
  }
  const objectUrl = window.URL.createObjectURL(files[0]);
  // TODO: Error check
  const graphData = await process(objectUrl);
  window.URL.revokeObjectURL(objectUrl);
  await addGraph(graphData);
};

// Create an invisible input file field to store a screenshot to be imported.
const HiddenFileInputField = ({ addGraph }) => (
  <input
    accept="image/*"
    style={{ display: "none" }}
    id={HIDDEN_INPUT_FIELD_ID}
    type="file"
    onChange={evt => fileChangedHandler(evt, addGraph)}
  />
);

// The Select Image button merely acts as a click on the invisible file input.
const SelectImageButton = ({ repick = false }) => {
  const commonProps = {
    fullWidth: true,
    component: "div",
    size: "large"
  };

  return (
    <label htmlFor={HIDDEN_INPUT_FIELD_ID} style={{ width: "100%" }}>
      {repick ? (
        <Button variant="outlined" {...commonProps}>
          Pick Different Image
        </Button>
      ) : (
        <TealButton variant="contained" {...commonProps}>
          Select Image
        </TealButton>
      )}
    </label>
  );
};

const ImportDialog = props => {
  const { classes, handleClose, isOpen, day, addGraph } = props;
  const dataExists = day.get("graph").size > 0;
  const showInstructions = !dataExists;
  const errorOccurred = false; // TODO
  const pickImageButton = <SelectImageButton />;
  const repickImageButton = <SelectImageButton repick />;

  // The dialog contents will vary depending on the situation:
  let mainContents;
  if (dataExists) {
    // The user has just now uploaded their screenshot, or has previously
    // uploaded it successfully in the past.
    mainContents = (
      <SuccessScreen
        repickImageButton={repickImageButton}
        handleClose={handleClose}
        day={day}
      />
    );
  } else if (errorOccurred) {
    // We've failed to digitize an uploaded screenshot just now.
    mainContents = (
      <>
        <Typography variant="body1" className={classes.paragraph}>
          We're sorry, we couldn't detect your glucose data.
        </Typography>
        {repickImageButton}
      </>
    );
  } else {
    // The user hasn't yet attempted to upload a screenshot.
    mainContents = pickImageButton;
  }

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={SlideUp}
    >
      <AppBar handleClose={handleClose} />
      <HiddenFileInputField addGraph={addGraph} />
      <div>
        <section className={classes.section}>
          <main>{mainContents}</main>
        </section>
        {showInstructions && (
          <>
            <Divider />
            <section className={classes.section}>
              <Instructions />
            </section>
            <section className={classes.section}>{pickImageButton}</section>
          </>
        )}
      </div>
    </Dialog>
  );
};

ImportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  day: PropTypes.object.isRequired,
  addGraph: PropTypes.func.isRequired
};

export default withStyles(styles)(ImportDialog);
