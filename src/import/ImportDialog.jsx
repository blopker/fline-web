import React, { useState } from "react";
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

// When an image is selected, attempt to digitize it and persist to the DB.
const fileChangedHandler = async (
  event,
  addGraph,
  setErrorOccurred,
  setIsLoading
) => {
  const { files } = event.target;
  if (!files.length) return;

  setIsLoading(true);

  setTimeout(async () => {
    const objectUrl = window.URL.createObjectURL(files[0]);
    try {
      const graphData = await process(objectUrl);
      // Save the digitized results
      await addGraph(graphData);
      setErrorOccurred(false);
    } catch (err) {
      console.error(err);
      setErrorOccurred(true);
    } finally {
      window.URL.revokeObjectURL(objectUrl);
      setIsLoading(false);
    }
  }, 0);
};

// Create an invisible input file field to store a screenshot to be imported.
const HiddenFileInputField = ({ addGraph, setErrorOccurred, setIsLoading }) => (
  <input
    accept="image/*"
    style={{ display: "none" }}
    id={HIDDEN_INPUT_FIELD_ID}
    type="file"
    onChange={evt =>
      fileChangedHandler(evt, addGraph, setErrorOccurred, setIsLoading)
    }
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

/**
 * The ImportDialog prompts the user to select a screenshot of their daily
 * glucose graph. After the screenshot is selected, is it scanned to extract
 * numerical data from the graph image.
 */

const ImportDialog = props => {
  const { classes, isOpen, day, addGraph } = props;
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dataExists = day.get("graph").size > 0;
  const showInstructions = !dataExists || (dataExists && errorOccurred);
  const pickImageButton = <SelectImageButton disabled={isLoading} />;
  const repickImageButton = <SelectImageButton repick disabled={isLoading} />;

  const handleClose = () => {
    // Reset any errors when the dialog is closed
    setErrorOccurred(false);
    props.handleClose();
  };

  // The dialog contents will vary depending on the situation:
  let mainContents;
  if (!dataExists && isLoading) {
    mainContents = (
      <Typography variant="body1" className={classes.paragraph}>
        Processing...
      </Typography>
    );
  } else if (dataExists && !errorOccurred) {
    // The user has just now uploaded their screenshot, or has previously
    // uploaded it successfully in the past.
    mainContents = (
      <SuccessScreen
        repickImageButton={repickImageButton}
        handleClose={handleClose}
        day={day}
        isLoading={isLoading}
      />
    );
  } else if (errorOccurred) {
    // We've failed to digitize an uploaded screenshot just now.
    mainContents = (
      <>
        <Typography variant="body1" className={classes.paragraph}>
          <span role="img" aria-label="Cross Mark">
            ❌
          </span>{" "}
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
      <HiddenFileInputField
        addGraph={addGraph}
        setErrorOccurred={setErrorOccurred}
        setIsLoading={setIsLoading}
      />
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
