import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

const styles = theme => ({
  log: {
    backgroundColor: theme.palette.background.paper
  }
});

function EntryListItem(props) {
  return (
    <ListItem>
      <ListItemText>{props.time}</ListItemText>
      <ListItemText primary={props.entry} />
      <ListItemSecondaryAction>
        <IconButton aria-label="Edit">
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

class InteractiveList extends React.Component {
  state = {
    dense: false
  };

  render() {
    const { classes } = this.props;
    const { dense } = this.state;

    return (
      <div className={classes.log}>
        <List dense={dense}>
          <EntryListItem time="10:00am" entry="5 shots of vodka" />
          <EntryListItem time="10:30am" entry="6 shots of vodka" />
          <EntryListItem time="11:00am" entry="10 shots of vodka" />
        </List>
      </div>
    );
  }
}

InteractiveList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InteractiveList);
