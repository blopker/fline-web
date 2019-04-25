import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TealButton from "./TealButton";
import Graph from "./Graph";

const SuccessScreen = props => {
  const { day, repickImageButton, handleClose } = props;

  return (
    <div>
      <Typography variant="body1">
        <span role="img" aria-label="Checkmark">
          ✅
        </span>{" "}
        Glucose data added
      </Typography>

      <div style={{ width: "90%", height: 260, margin: "auto" }}>
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
