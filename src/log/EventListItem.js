import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import EventGraph from "./EventGraph";
import { withStyles } from "@material-ui/core";

const timeFormatter = new Intl.DateTimeFormat("default", {
  hour: "2-digit",
  minute: "2-digit"
});

const styles = theme => ({
  item: {
    display: "flex"
  },
  time: {
    flex: "0 0 auto",
    textAlign: "left",
    padding: 0,
    minWidth: 55
  }
});

const EventListItem = props => {
  const { eventID, event, day, classes } = props;
  const time = event.get("time");
  const entry = event.get("event");
  const graph = day.get("graph");

  return (
    <>
      <ListItem
        button
        component={Link}
        to={`/edit/${eventID}`}
        className={classes.item}
      >
        <ListItemText className={classes.time}>
          {timeFormatter.format(time)}
        </ListItemText>
        <ListItemText>{entry}</ListItemText>
      </ListItem>
      {graph.size > 0 && <EventGraph day={day} event={event} />}
      <Divider />
    </>
  );
};

EventListItem.propTypes = {
  eventID: PropTypes.number.isRequired,
  event: PropTypes.object.isRequired,
  day: PropTypes.object
};

export default withStyles(styles)(EventListItem);
