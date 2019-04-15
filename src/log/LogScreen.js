import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "./AppBar";
import FloatingEditButton from "./Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Chart from "../Chart";

const styles = theme => ({
  log: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: "56px",
    paddingLeft: "10px",
    paddingRight: "10px"
  }
});

function EntryListItem(props) {
  return (
    <ListItem>
      <ListItemText>{props.time}</ListItemText>
      <ListItemText primary={props.entry} />
    </ListItem>
  );
}

function Event(props) {
  return (
    <>
      <EntryListItem time={props.event.time} entry={props.event.event} />
      {props.graph.length !== 0 && <Chart data={props.graph} />}
    </>
  );
}

function LogScreen(props) {
  const { classes } = props;
  if (!props.day) {
    return <div>Loading...</div>;
  }

  const els = props.day.events.map((e, i) => {
    return <Event key={i} graph={props.day.graph} event={e} />;
  });

  return (
    <>
      <AppBar setDate={props.setDate} date={props.date} />
      {els.length !== 0 && (
        <div className={classes.log}>
          <List dense={true}>{els}</List>
        </div>
      )}
      <FloatingEditButton initialState={els.length === 0} />
    </>
  );
}

LogScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogScreen);
