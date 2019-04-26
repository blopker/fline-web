import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TealButton from "./TealButton";
import Graph from "./Graph";

/**
 * The SuccessScreen shows when a screenshot has been successfully imported.
 * This screen plots the results of the digitized data into a line graph.
 * There is also a button to reselect the screenshot to try importing again.
 */

const SuccessScreen = props => {
  const { day, repickImageButton, handleClose, isLoading } = props;

  let message;
  if (isLoading) {
    message = "Processing...";
  } else {
    message = (
      <>
        <span role="img" aria-label="Checkmark">
          ✅
        </span>{" "}
        Glucose data added
      </>
    );
  }

  return (
    <div>
      <Typography variant="body1">{message}</Typography>
      <div
        style={{
          width: "90%",
          height: 260,
          margin: "auto",
          opacity: isLoading ? 0.25 : 1
        }}
      >
        <Graph data={day.get("graph")} />
      </div>

      <TealButton
        fullWidth
        size="large"
        onClick={handleClose}
        style={{ margin: "16px 0" }}
      >
        Ok
      </TealButton>

      {repickImageButton}
    </div>
  );
};

SuccessScreen.propTypes = {
  day: PropTypes.object.isRequired,
  repickImageButton: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default SuccessScreen;
