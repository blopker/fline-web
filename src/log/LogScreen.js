import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "./AppBar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
const styles = theme => ({
  log: {
    backgroundColor: theme.palette.background.paper
  },
  fab: {
    margin: theme.spacing.unit * 2,
    position: "absolute",
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

function LogScreen(props) {
  const { classes } = props;

  return (
    <>
      <AppBar setDate={props.setDate} date={props.date} />
      <WrapFloatingEditButton />
      <div className={classes.log}>
        <List dense={true}>
          <EntryListItem time="10:00am" entry="5 shots of vodka" />
          <EntryListItem time="10:30am" entry="6 shots of vodka" />
          <EntryListItem time="11:00am" entry="10 shots of vodka" />
        </List>
      </div>
    </>
  );
}

LogScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogScreen);
