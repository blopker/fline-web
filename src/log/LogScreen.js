import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "./AppBar";
import FloatingEditButton from "./Fab";
import List from "@material-ui/core/List";
import ImportGlucoseDataBanner from "./ImportGlucoseDataBanner";
import EventListItem from "./EventListItem";

const styles = theme => ({
  log: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: 64
  }
});

function LogScreen(props) {
  const { classes, day, date, setDate, addGraph } = props;
  if (!day) {
    return <div>Loading...</div>;
  }

  const events = day.get("events");
  const graph = day.get("graph");

  const els = events.map((e, i) => (
    <EventListItem key={i} eventID={i} event={e} graph={graph} />
  ));

  return (
    <>
      <AppBar setDate={setDate} date={date} />
      {els.size !== 0 && (
        <>
          <ImportGlucoseDataBanner day={day} addGraph={addGraph} />
          <List dense className={classes.log}>
            {els}
          </List>
        </>
      )}
      <FloatingEditButton initialState={els.size === 0} />
    </>
  );
}

LogScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogScreen);
