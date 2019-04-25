import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "./AppBar";
import FloatingEditButton from "./Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Chart from "../Chart";
import { Link } from "react-router-dom";
import ImportGlucoseDataBanner from "./ImportGlucoseDataBanner";

const styles = theme => ({
  log: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: "10px",
    paddingRight: "10px"
  }
});

function EntryListItem(props) {
  const time = props.time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  return (
    <ListItem>
      <ListItemText>{time}</ListItemText>
      <ListItemText primary={props.entry} />
    </ListItem>
  );
}

function Event(props) {
  return (
    <Link
      to={`/edit/${props.eventID}`}
      style={{ textDecoration: "none", color: "white" }}
    >
      <EntryListItem
        time={props.event.get("time")}
        entry={props.event.get("event")}
      />
      {/* {props.graph.size !== 0 && <Chart data={props.graph} />} */}
    </Link>
  );
}

function LogScreen(props) {
  const { classes, day, date, setDate, addGraph } = props;
  if (!day) {
    return <div>Loading...</div>;
  }

  const els = day
    .get("events")
    .map((e, i) => (
      <Event key={i} eventID={i} graph={day.get("graph")} event={e} />
    ));

  return (
    <>
      <AppBar setDate={setDate} date={date} />
      <ImportGlucoseDataBanner day={day} addGraph={addGraph} />
      {els.size !== 0 && (
        <div className={classes.log}>
          <List dense={true}>{els}</List>
        </div>
      )}
      <FloatingEditButton initialState={els.size === 0} />
    </>
  );
}

LogScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogScreen);
