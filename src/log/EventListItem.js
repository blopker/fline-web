import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import EventGraph from "./EventGraph";

const timeFormatter = new Intl.DateTimeFormat("default", {
  hour: "2-digit",
  minute: "2-digit"
});

const EventListItem = props => {
  const { eventID, event, day } = props;
  const time = event.get("time");
  const entry = event.get("event");
  const graph = day.get("graph");

  return (
    <>
      <ListItem button component={Link} to={`/edit/${eventID}`}>
        <ListItemText>{timeFormatter.format(time)}</ListItemText>
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

export default EventListItem;
