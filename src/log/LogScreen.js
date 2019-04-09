import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "./AppBar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import Chart from "../Chart";

const styles = theme => ({
  log: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: "56px",
    paddingLeft: "10px",
    paddingRight: "10px"
  },
  fab: {
    margin: theme.spacing.unit * 2,
    position: "fixed",
    bottom: 0,
    right: 0
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

function FloatingEditButton(props) {
  const { classes } = props;
  return (
    <Link to="/edit/">
      <Fab color="primary" aria-label="Edit" className={classes.fab}>
        <EditIcon />
      </Fab>
    </Link>
  );
}

let WrapFloatingEditButton = withStyles(styles)(FloatingEditButton);

function Event(props) {
  return (
    <>
      <EntryListItem time={props.event.time} entry={props.event.event} />
      <Chart data={props.graph} />
    </>
  );
}

function LogScreen(props) {
  const { classes } = props;
  if (!props.day) {
    return <div>Enter data</div>;
  }

  const els = props.day.events.map(e => {
    return <Event graph={props.day.graph} event={e} />;
  });

  return (
    <>
      <AppBar setDate={props.setDate} date={props.date} />

      <div className={classes.log}>
        <List dense={true}>{els}</List>
      </div>
      <WrapFloatingEditButton />
    </>
  );
}

LogScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogScreen);
