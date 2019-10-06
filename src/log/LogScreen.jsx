import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { isSameDay, startOfDay, addDays } from "date-fns";
import { Route, Link } from "react-router-dom";
import List from "@material-ui/core/List";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import get from "lodash/get";
import AppBar from "./AppBar";
import CreateFab from "./CreateFab";
import EntryListItem from "./EntryListItem";
import ImportGlucoseDataBanner from "./ImportGlucoseDataBanner";
import ImportDialog from "../import/ImportDialog";
import EditDialog from "../edit/EditDialog";
import ExploreDialog from "../explore/ExploreDialog";
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

  const [showReminderDialog, setShowReminderDialog] = useState(false);

  const closeReminderDialog = () => setShowReminderDialog(false);

  const onShowMeHow = () => {
    setDate(addDays(date, -1));
    setShowReminderDialog(false);
  }

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

  // Always land on today's date whenever the app comes to the foreground
  useEffect(() => {
    const ensureCurrentDate = () => {
      const becameVisible = !document.hidden;
      const dateMismatch = !isSameDay(date, new Date());
      const mightBeImporting = routeProps.location.pathname === "/log/import";
      if (becameVisible && dateMismatch && !mightBeImporting) {
        setDate(startOfDay(new Date()));
        routeProps.history.replace("/log");
      }
    };
    document.addEventListener("visibilitychange", ensureCurrentDate);
    return function cleanup() {
      document.removeEventListener("visibilitychange", ensureCurrentDate);
    };
  });

  const saveLogEntryAndReload = useCallback(
    async entry => {
      if (logData.logEntries.length === 0) {
        const yesterday = startOfDay(new Date(date).setDate(date.getDate() - 1));
        const [logEntries, bloodGlucoseLevels] = await Promise.all([
          db.getLogEntriesForDay(yesterday),
          db.getBloodGlucoseLevelsForDay(yesterday)
        ]);
        console.log(date, yesterday, logEntries, bloodGlucoseLevels);
        if (logEntries.length > 0 && bloodGlucoseLevels.length === 0) {
          setShowReminderDialog(true);
        }
      }
      await db.saveLogEntry(entry);
      await loadLogData(date);
    },
    [date, loadLogData, logData, db]
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
            date={date}
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

      <Route path={`/log/explore`}>
        {routeProps => (
          <ExploreDialog
            isOpen={routeProps.match !== null}
            onClose={handleCloseDialog}
          />
        )}
      </Route>

      <Dialog
        open={showReminderDialog}
        onClose={closeReminderDialog}
        aria-labelledby="reminder-dialog-title"
        data-testid="reminderDialog"
      >
        <DialogTitle id="reminder-dialog-title">
          Psst... Let's add yesterday's glucose data.
          {" "}
          <span role="img" aria-label="Hugging Face">
            🤗
          </span>
        </DialogTitle>
        <DialogActions>
          <Link
            to="/log/import"
            onClick={onShowMeHow}
            style={{ textDecoration: "none" }}
          >
            <Button color="secondary">
              Show Me How
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
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
