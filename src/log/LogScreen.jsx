import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import List from "@material-ui/core/List";
import { withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import AppBar from "./AppBar";
import CreateFab from "./CreateFab";
import EntryListItem from "./EntryListItem";
import ImportGlucoseDataBanner from "./ImportGlucoseDataBanner";
import ImportDialog from "../import/ImportDialog";
import EditDialog from "../edit/EditDialog";

import { useDatabase } from "../databaseContext";

const styles = theme => ({
  log: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: 64
  }
});

function LogScreen(props) {
  const { date, setDate, routeProps, classes } = props;
  const db = useDatabase();

  // Any entries and graph data corresponding to the selected date
  const [logData, setLogData] = useState({
    logEntries: null,
    bloodGlucoseLevels: null
  });

  const { logEntries, bloodGlucoseLevels } = logData;

  // PERF: Avoid re-creating the function on every re-render
  const loadLogData = useCallback(
    async date => {
      const [logEntries, bloodGlucoseLevels] = await Promise.all([
        db.getLogEntriesForDay(date),
        db.getBloodGlucoseLevelsForDay(date)
      ]);
      setLogData({ logEntries, bloodGlucoseLevels });
    },
    [setLogData, db]
  );

  // Any time the date changes, invalidate and reload the logData
  useEffect(() => {
    loadLogData(date);
  }, [date, loadLogData]);

  const saveLogEntryAndReload = useCallback(
    async entry => {
      await db.saveLogEntry(entry);
      await loadLogData(date);
    },
    [date, loadLogData, db]
  );

  const saveBloodGlucoseLevelsAndReload = useCallback(
    async digitizedData => {
      await db.saveBloodGlucoseLevels(date, digitizedData);
      await loadLogData(date);
    },
    [date, loadLogData, db]
  );

  const handleCloseDialog = () => {
    const { history } = routeProps;
    if (history.length > 1) {
      history.goBack();
    } else {
      history.replace("/log");
    }
  };

  if (logEntries === null) {
    return <div>Loading...</div>;
  }

  const logEntriesExist = logEntries.length > 0;
  const hasImportedAlready = bloodGlucoseLevels.length > 0;

  return (
    <>
      <AppBar setDate={setDate} date={date} menu={props.menu} />
      {logEntriesExist && (
        <>
          <ImportGlucoseDataBanner hasImportedAlready={hasImportedAlready} />
          <List dense className={classes.log}>
            {logEntries.map((entry, idx) => (
              <EntryListItem
                key={entry.id}
                entry={entry}
                subsequentEntry={logEntries[idx + 1]}
                bloodGlucoseLevels={bloodGlucoseLevels}
              />
            ))}
          </List>
        </>
      )}

      <CreateFab
        initialState={!logEntriesExist}
        addEvent={saveLogEntryAndReload}
        date={date}
      />

      <Route path={`/log/import`}>
        {routeProps => (
          <ImportDialog
            isOpen={routeProps.match !== null}
            onClose={handleCloseDialog}
            bloodGlucoseLevels={bloodGlucoseLevels}
            onImport={saveBloodGlucoseLevelsAndReload}
          />
        )}
      </Route>

      <Route path={`/log/edit/:entryId?`}>
        {routeProps => {
          let entry;
          const entryId = parseInt(get(routeProps, "match.params.entryId"), 10);
          if (entryId) {
            entry = logEntries.find(e => e.id === entryId);
          }
          return (
            <EditDialog
              isOpen={routeProps.match !== null}
              onClose={handleCloseDialog}
              saveEntry={saveLogEntryAndReload}
              entry={entry}
              date={date}
            />
          );
        }}
      </Route>
    </>
  );
}

LogScreen.propTypes = {
  classes: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired,
  menu: PropTypes.element.isRequired
};

export default withStyles(styles)(LogScreen);
