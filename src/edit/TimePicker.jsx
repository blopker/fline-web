import "date-fns";
import React from "react";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, TimePicker } from "material-ui-pickers";

function MaterialUIPickers(props) {
  const { time, setTime } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TimePicker
        margin="normal"
        label="When?"
        value={time}
        onChange={setTime}
      />
    </MuiPickersUtilsProvider>
  );
}

MaterialUIPickers.propTypes = {
  time: PropTypes.object.isRequired,
  setTime: PropTypes.func.isRequired
};

export default MaterialUIPickers;
