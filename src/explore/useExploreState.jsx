import { useState, useEffect, useReducer, useMemo } from "react";
import { addHours, isWithinInterval } from "date-fns";
import union from "lodash/union";
import without from "lodash/without";
import xor from "lodash/xor";
import { useDatabase } from "../databaseContext";

/**
|--------------------------------------------------
| Explore Reducer Composite Handlers
|--------------------------------------------------
*/

const tagsLoaded = (state, action) => {
  const { tags, dateLoaded } = action.payload;
  return {
    ...state,
    tags,
    selectedTag: tags[0] || null,
    tagsDateLoaded: dateLoaded
  };
};

const selectTag = (state, action) => {
  const selectedTag = action.payload;
  return { ...state, selectedTag };
};

const entriesLoaded = (state, action) => {
  const { exploreEntries, dateLoaded } = action.payload;
  let { checkedEntryIds } = state;
  // Check the first entry by default is no other entries are already checked
  if (!exploreEntries.some(entry => checkedEntryIds.includes(entry.id))) {
    const firstEntryWithData = exploreEntries.find(e => e.hasEnoughData);
    if (firstEntryWithData) {
      checkedEntryIds = union(checkedEntryIds, [firstEntryWithData.id]);
    }
  }
  return {
    ...state,
    exploreEntries,
    exploreEntriesDateLoaded: dateLoaded,
    checkedEntryIds
  };
};

const highlightEntry = (state, action) => {
  const entryId = action.payload;
  let { highlightedEntryId, checkedEntryIds } = state;
  // If the entry is already highlighted, un-highlight it
  if (highlightedEntryId === entryId) {
    highlightedEntryId = null;
  } else {
    // highlighting an entry also checks that entry
    highlightedEntryId = entryId;
    checkedEntryIds = union(state.checkedEntryIds, [entryId]);
  }
  return {
    ...state,
    highlightedEntryId,
    checkedEntryIds
  };
};

const toggleEntryChecked = (state, action) => {
  const entryId = action.payload;
  const checkedEntryIds = xor(state.checkedEntryIds, [entryId]);
  // If the entry is currently highlighted, assume that the toggling operation
  // has unchecked the entry and that we will also need to un-highlight as well
  let { highlightedEntryId } = state;
  if (highlightedEntryId === entryId) {
    highlightedEntryId = null;
  }
  return {
    ...state,
    checkedEntryIds,
    highlightedEntryId
  };
};

const checkAllEntries = (state, action) => {
  const ids = state.exploreEntries.map(entry => entry.id);
  const checkedEntryIds = union(state.checkedEntryIds, ids);
  return { ...state, checkedEntryIds };
};

const uncheckAllEntries = (state, action) => {
  const ids = state.exploreEntries.map(entry => entry.id);
  const checkedEntryIds = without(state.checkedEntryIds, ...ids);
  let { highlightedEntryId } = state;
  if (ids.includes(highlightedEntryId)) {
    highlightedEntryId = null;
  }
  return {
    ...state,
    checkedEntryIds,
    highlightedEntryId
  };
};

/**
|--------------------------------------------------
| Explore Reducer
|--------------------------------------------------
*/

const exploreReducer = (state, action) => {
  const handlers = {
    TAGS_LOADED: tagsLoaded,
    SELECT_TAG: selectTag,
    ENTRIES_LOADED: entriesLoaded,
    HIGHLIGHT_ENTRY: highlightEntry,
    TOGGLE_ENTRY_CHECKED: toggleEntryChecked,
    CHECK_ALL_ENTRIES: checkAllEntries,
    UNCHECK_ALL_ENTRIES: uncheckAllEntries
  };
  if (action.type in handlers) {
    return handlers[action.type](state, action);
  }
  throw new Error(`unhandled action "${action.type}" in exploreReducer`);
};

/**
|--------------------------------------------------
| useExploreState Hook
|--------------------------------------------------
*/

const useExploreState = () => {
  const [refreshToken, setRefreshToken] = useState(() => Date.now());

  const [state, dispatch] = useReducer(exploreReducer, {
    tags: [],
    tagsDateLoaded: null,
    selectedTag: null,
    exploreEntries: [],
    exploreEntriesDateLoaded: null,
    highlightedEntryId: null,
    checkedEntryIds: []
  });

  const { tags, selectedTag, tagsDateLoaded, exploreEntriesDateLoaded } = state;

  const {
    getUtilizedTags,
    getLogEntriesForTag,
    getBloodGlucoseLevelsForLogEntry
  } = useDatabase();

  // Load the Tags anytime the refresh token changes
  useEffect(() => {
    async function initializeTags() {
      const utilizedTags = await getUtilizedTags();
      dispatch({
        type: "TAGS_LOADED",
        payload: { tags: utilizedTags, dateLoaded: Date.now() }
      });
    }
    initializeTags();
  }, [refreshToken, getUtilizedTags]);

  // Load the Entries for the selected Tag anytime the selected Tag changes
  // Also reload anytime tagsDateLoaded has changed due to a refresh
  useEffect(() => {
    async function loadEntries(tag) {
      const logEntries = await getLogEntriesForTag(tag);
      const bloodGlucoseLevels = await Promise.all(
        logEntries.map(getBloodGlucoseLevelsForLogEntry)
      );

      // Combine the LogEntries and BloodGlucoseLevels into a single new object
      const exploreEntries = logEntries.map((logEntry, index) => {
        const exploreEntry = {
          ...logEntry,
          bloodGlucoseLevels: bloodGlucoseLevels[index]
        };
        // PERF: Pre-compute whether there is enough data to graph this entry
        const entryTimeWindow = {
          start: logEntry.date,
          end: addHours(logEntry.date, 2)
        };
        const levelsWithinEntryWindow = exploreEntry.bloodGlucoseLevels.filter(
          lvl => isWithinInterval(lvl.date, entryTimeWindow)
        );
        exploreEntry.hasEnoughData = levelsWithinEntryWindow.length > 2;
        return exploreEntry;
      });

      dispatch({
        type: "ENTRIES_LOADED",
        payload: { exploreEntries, dateLoaded: Date.now() }
      });
    }

    if (selectedTag) {
      loadEntries(selectedTag);
    }
  }, [
    selectedTag,
    tagsDateLoaded,
    getLogEntriesForTag,
    getBloodGlucoseLevelsForLogEntry
  ]);

  // Rather than providing dispatch directly to the hook consumer, create a set
  // of actions that can be exposed as an API for triggering changes to state
  const actions = useMemo(
    () => ({
      setSelectedTag: tag => dispatch({ type: "SELECT_TAG", payload: tag }),
      selectAll: () => dispatch({ type: "CHECK_ALL_ENTRIES" }),
      deselectAll: () => dispatch({ type: "UNCHECK_ALL_ENTRIES" }),
      highlightEntry: entryId =>
        dispatch({ type: "HIGHLIGHT_ENTRY", payload: entryId }),
      toggleEntry: entryId =>
        dispatch({ type: "TOGGLE_ENTRY_CHECKED", payload: entryId }),
      refresh: () => setRefreshToken(() => Date.now())
    }),
    [dispatch]
  );

  const tagsLoading = !tagsDateLoaded;
  const tagsExist = !tagsLoading && tags.length > 0;
  const entriesLoading = tagsExist && !exploreEntriesDateLoaded;
  const isLoading = tagsLoading || entriesLoading;
  const isEmpty = !tagsExist;

  return {
    ...state,
    ...actions,
    isLoading,
    isEmpty
  };
};

export default useExploreState;
