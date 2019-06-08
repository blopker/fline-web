import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";

import ComparisonGraph from "./ComparisonGraph";
import ExploreList from "./ExploreList";
import ExploreAppBar from "./AppBar";
import useExploreState from "./useExploreState";
import TagSelector from "./TagSelector";
import EmptyState from "./EmptyState";

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      display: "flex",
      flexDirection: "column",
      overflowY: "hidden"
    }
  }),
  { name: "ExploreDialog" }
);

const SlideUp = React.forwardRef((props, ref) => (
  <Slide unmountOnExit direction="up" ref={ref} {...props} />
));

const ExploreDialog = props => {
  const { isOpen, onClose } = props;
  const classes = useStyles();

  const {
    tags,
    selectedTag,
    exploreEntries,
    highlightedEntryId,
    checkedEntryIds,
    setSelectedTag,
    selectAll,
    deselectAll,
    highlightEntry,
    toggleEntry,
    refresh,
    isEmpty,
    isLoading
  } = useExploreState();

  useEffect(() => {
    if (isOpen) {
      console.warn("refreshing");
      refresh();
    }
  }, [isOpen, refresh]);

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={SlideUp}
      scroll="paper"
    >
      <ExploreAppBar onClose={onClose} />

      {isLoading && (
        <Box display="flex" justifyContent={"center"} margin={5}>
          <CircularProgress />
        </Box>
      )}

      {isEmpty && <EmptyState />}

      {!isLoading && !isEmpty && (
        <div className={classes.wrapper}>
          <Paper elevation={1}>
            <TagSelector
              tags={tags}
              selectedTag={selectedTag}
              onChange={setSelectedTag}
            />
            <Divider />
            <Box display="flex" justifyContent="center" p={1}>
              <ComparisonGraph
                selectedTag={selectedTag}
                entries={exploreEntries}
                checkedEntryIds={checkedEntryIds}
                highlightedEntryId={highlightedEntryId}
              />
            </Box>
            <Box display="flex" justifyContent="center" marginBottom={1}>
              <Button size="small" onClick={selectAll}>
                Select All
              </Button>
              <Button size="small" onClick={deselectAll}>
                Deselect All
              </Button>
            </Box>
            <Divider />
          </Paper>

          <ExploreList
            selectedTag={selectedTag}
            entries={exploreEntries}
            checkedEntryIds={checkedEntryIds}
            highlightedEntryId={highlightedEntryId}
            onCheckToggle={toggleEntry}
            onClick={highlightEntry}
          />
        </div>
      )}
    </Dialog>
  );
};

ExploreDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default ExploreDialog;
