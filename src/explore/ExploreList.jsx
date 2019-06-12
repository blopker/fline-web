import React, { useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import partition from "lodash/partition";

import ExploreListItem from "./ExploreListItem";

const useStyles = makeStyles(
  theme => ({
    root: {
      overflowY: "auto"
    },
    subheader: {
      textTransform: "capitalize"
    },
    compact: {
      paddingTop: theme.spacing(0.25),
      paddingBottom: theme.spacing(0.25)
    }
  }),
  { name: "ExploreList" }
);

const ExploreList = props => {
  const classes = useStyles();
  const {
    checkedEntryIds,
    entries,
    highlightedEntryId,
    onCheckToggle,
    onClick,
    selectedTag
  } = props;

  // Reset the scroll position of the list when changing Tags
  const listRef = useRef(null);
  useLayoutEffect(() => {
    listRef.current.scrollTop = 0;
  }, [selectedTag]);

  const [entriesWithData, entriesWithoutData] = partition(
    entries,
    "hasEnoughData"
  );

  const renderEntryWithData = entry => (
    <ExploreListItem
      key={entry.id}
      entry={entry}
      isChecked={checkedEntryIds.includes(entry.id)}
      isHighlighted={entry.id === highlightedEntryId}
      onClick={onClick}
      onCheckToggle={onCheckToggle}
    />
  );

  const renderEntryWithoutData = entry => (
    <ListItem key={entry.id} className={classes.compact} divider>
      <ListItemText secondary={entry.description} />
    </ListItem>
  );

  return (
    <div className={classes.root} ref={listRef}>
      {entriesWithData.length > 0 && (
        <>
          <List dense data-testid="entriesWithData">
            <ListSubheader className={classes.subheader} disableSticky>
              {selectedTag} Entries
            </ListSubheader>
            {entriesWithData.map(renderEntryWithData)}
          </List>
          <Box marginBottom={1} />
        </>
      )}
      {entriesWithoutData.length > 0 && (
        <>
          <List dense data-testid="entriesWithoutData">
            <ListSubheader className={classes.subheader} disableSticky>
              {selectedTag} Entries Without Enough Data
            </ListSubheader>
            {entriesWithoutData.map(renderEntryWithoutData)}
          </List>
        </>
      )}
      <Box marginBottom={5} />
    </div>
  );
};

ExploreList.propTypes = {
  selectedTag: PropTypes.string.isRequired,
  entries: PropTypes.array.isRequired
};

export default ExploreList;
