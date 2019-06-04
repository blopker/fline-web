import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDatabase } from "../databaseContext";

import { differenceInSeconds } from "date-fns";
import pick from "lodash/pick";
import union from "lodash/union";
import without from "lodash/without";
import xor from "lodash/xor";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

import ComparisonGraph from "./ComparisonGraph";
// import { ENTRY_TAGS } from "../constants";

const useStyles = makeStyles(
  theme => ({
    stickyTagBar: {
      borderRadius: 0,
      position: "sticky",
      // Position the tag bar just below the AppBar, which varies by screen size
      top: 56,
      [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
        top: 48
      },
      [theme.breakpoints.up("sm")]: {
        top: 64
      }
    },
    scrollingHorizontalList: {
      padding: theme.spacing(1),
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      "&::after": {
        content: "''",
        flex: "none",
        width: theme.spacing(4)
      }
    },
    chip: {
      margin: theme.spacing(0.5)
    },

    addTransparentBorder: {
      border: "solid 1px transparent"
    }
  }),
  { name: "ExploreDialog" }
);

const SlideUp = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const ExploreDialog = props => {
  const { isOpen, onClose } = props;
  const classes = useStyles();
  const {
    getLogEntriesForTag,
    getUtilizedTags,
    getBloodGlucoseLevelsForLogEntry
  } = useDatabase();
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectableTags, setSelectableTags] = useState([]);
  const [entries, setEntries] = useState([]);
  const [
    bloodGlucoseLevelsByEntryId,
    setBloodGlucoseLevelsByEntryId
  ] = useState({});
  const [highlightedEntryId, setHighlightedEntryId] = useState(null);
  const [checkedEntryIds, setCheckedEntryIds] = useState([]);

  const handleSelectAllClick = () => {
    const ids = entries.map(entry => entry.id);
    setCheckedEntryIds(prev => union(prev, ids));
  };

  const handleDeselectAllClick = () => {
    const ids = entries.map(entry => entry.id);
    setCheckedEntryIds(prev => without(prev, ...ids));
    if (ids.includes(highlightedEntryId)) {
      setHighlightedEntryId(null);
    }
  };

  const handleCheckToggle = entryId => () => {
    setCheckedEntryIds(prev => xor(prev, [entryId]));
    if (highlightedEntryId === entryId) {
      setHighlightedEntryId(null);
    }
  };

  const handleEntryClick = entryId => () => {
    setHighlightedEntryId(prev => (prev === entryId ? null : entryId));
    setCheckedEntryIds(prev => union(prev, [entryId]));
  };

  const handleChipClick = e => {
    const newTag = e.currentTarget.textContent;
    if (!newTag) return;
    setSelectedTag(newTag);
  };

  // Set the initial selected tag
  useEffect(() => {
    async function initializeTags() {
      const utilizedTags = await getUtilizedTags();
      if (utilizedTags) {
        setSelectableTags(utilizedTags);
        setSelectedTag(utilizedTags[0]);
      } else {
        setIsLoading(false);
        setShowEmptyState(true);
      }
    }
    if (isOpen) {
      initializeTags();
    }
  }, [getUtilizedTags, isOpen]);

  // load entries when selected tag changes
  useEffect(() => {
    async function loadData(tag) {
      const entries = await getLogEntriesForTag(tag);
      const bloodGlucoseLevels = await Promise.all(
        entries.map(getBloodGlucoseLevelsForLogEntry)
      );

      // Key the graph data by LogEntry ID for quicker reference
      const bloodGlucoseLevelsByEntryId = {};
      entries.forEach((entry, index) => {
        const levelsForEntry = bloodGlucoseLevels[index];
        // Tack on an extra property tracking the elapsed number of seconds
        // since the LogEntry time for each of the blood glucose readings
        levelsForEntry.forEach(lvl => {
          lvl.entryTimeDelta = differenceInSeconds(lvl.date, entry.date);
        });
        bloodGlucoseLevelsByEntryId[entry.id] = levelsForEntry;
      });

      setEntries(entries);
      setBloodGlucoseLevelsByEntryId(bloodGlucoseLevelsByEntryId);
      setIsLoading(false);
      console.log({ entries, bloodGlucoseLevelsByEntryId }); // TODO TODO
    }
    if (selectedTag) {
      loadData(selectedTag);
    }
  }, [selectedTag, getLogEntriesForTag, getBloodGlucoseLevelsForLogEntry]);

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={SlideUp}
      scroll="paper"
    >
      <AppBar position="sticky">
        <Toolbar>
          <IconButton color="inherit" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Explore</Typography>
        </Toolbar>
      </AppBar>

      {isLoading && <CircularProgress />}
      {showEmptyState && "Empty state"}
      {!isLoading && !showEmptyState && (
        <>
          {/* <TagSelector selectedTag={selectedTag} selectableTags onChange={setSelectedTag} /> */}
          <Paper className={classes.stickyTagBar} elevation={1}>
            <div className={classes.scrollingHorizontalList}>
              {selectableTags.map(currentTag => (
                <Chip
                  key={currentTag}
                  label={currentTag}
                  aria-label={currentTag}
                  className={classes.chip}
                  onClick={handleChipClick}
                  variant={selectedTag === currentTag ? "default" : "outlined"}
                  color={selectedTag === currentTag ? "secondary" : "default"}
                  classes={{ colorSecondary: classes.addTransparentBorder }}
                />
              ))}
            </div>
            <Divider />
            <Box display="flex" justifyContent="center" p={1}>
              {/* <pre style={{ overflow: "auto" }}>
                  {JSON.stringify(
                    pick(bloodGlucoseLevelsByEntryId, checkedEntryIds)
                  )}
                </pre> */}
              <ComparisonGraph
                selectedTag={selectedTag}
                series={pick(bloodGlucoseLevelsByEntryId, checkedEntryIds)}
                highlightedEntryId={highlightedEntryId}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <Button onClick={handleSelectAllClick}>Select All</Button>
              <Button onClick={handleDeselectAllClick}>Deselect All</Button>
            </Box>
            <Divider />
          </Paper>

          <List dense>
            {entries.map(entry => {
              return (
                <ListItem
                  key={entry.id}
                  button
                  divider
                  onClick={handleEntryClick(entry.id)}
                >
                  <div
                    style={{
                      color: entry.id === highlightedEntryId ? "orange" : null
                    }}
                  >
                    <ListItemText
                      primary={entry.description}
                      primaryTypographyProps={{ color: "inherit" }}
                    />
                  </div>
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={handleCheckToggle(entry.id)}
                      checked={checkedEntryIds.includes(entry.id)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </Dialog>
  );
};

ExploreDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default ExploreDialog;
