import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TealButton from "./TealButton";

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

      {/* TODO: show graph */}
      <pre
        style={{
          textAlign: "left",
          color: "white",
          height: 400,
          overflowY: "scroll"
        }}
      >
        {JSON.stringify(day.get("graph"), null, 2)}
      </pre>

      <TealButton fullWidth size="large" onClick={handleClose}>
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
