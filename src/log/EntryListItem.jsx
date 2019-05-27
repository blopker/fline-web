import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import EntryGraph from "./EntryGraph";
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
    paddingRight: theme.spacing(1),
    minWidth: 55
  }
});

const EntryListItem = props => {
  const { classes, entry, subsequentEntry, bloodGlucoseLevels = [] } = props;
  const LogEditLink = React.forwardRef((props, ref) => (
    <Link innerRef={ref} to={`/log/edit/${entry.id}`} {...props} />
  ));
  return (
    <>
      <ListItem
        data-testid="entryListItem"
        button
        className={classes.item}
        component={LogEditLink}
      >
        <ListItemText className={classes.time} data-testid="entryListItemTime">
          <time dateTime={entry.date.toISOString()}>
            {timeFormatter.format(entry.date)}
          </time>
        </ListItemText>
        <ListItemText data-testid="entryListItemDescription">
          {entry.description}
        </ListItemText>
      </ListItem>
      {bloodGlucoseLevels.length > 0 && (
        <div data-testid="entryListItemGraphContainer">
          <EntryGraph
            bloodGlucoseLevels={bloodGlucoseLevels}
            entry={entry}
            subsequentEntry={subsequentEntry}
          />
        </div>
      )}
      <Divider />
    </>
  );
};

EntryListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  entry: PropTypes.object.isRequired,
  subsequentEntry: PropTypes.object,
  bloodGlucoseLevels: PropTypes.array
};

export default withStyles(styles)(EntryListItem);
