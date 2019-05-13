import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "./AppBar";
import CreateFab from "./CreateFab";
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
  const { classes, day, date, setDate, addGraph, addEvent } = props;
  if (!day) {
    return <div>Loading...</div>;
  }

  const els = day
    .get("events")
    .map((e, i) => (
      <EventListItem
        key={i}
        eventID={i}
        event={e}
        day={day}
        addEvent={addEvent}
        date={date}
      />
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
      <CreateFab
        initialState={els.size === 0}
        addEvent={addEvent}
        date={date}
      />
    </>
  );
}

LogScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogScreen);
