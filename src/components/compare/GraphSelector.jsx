import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import EntryGraph from "../../log/EntryGraph";
import GraphSelectorDialog from "./GraphSelectorDialog"; 
import { useDatabase } from "../../databaseContext";

const timeFormatter = new Intl.DateTimeFormat("default", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const useStyles = makeStyles(theme => ({
  cardButton: {
    display: "block",
    width: "100%"
  },
  grahpSelector: {
    height: 180
  },
  grahpSelectorPlaceholder: {
    height: 224,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    display: "flex"
  },
  headerTime: {
    flex: "0 0 auto",
    textAlign: "left",
    padding: 0,
    paddingRight: theme.spacing(1),
    minWidth: 55
  }
}));

export default function GraphSelector(props) {
  const classes = useStyles();
  const db = useDatabase();

  const { entries, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState();
  const [bloodGlucoseLevels, setBloodGlucoseLevels] = useState();

  useEffect(() => {
    const fetchData = async (selectedEntry) => {
      const result = await db.getBloodGlucoseLevelsForLogEntry(selectedEntry);
      setBloodGlucoseLevels(result);
    };
    if (selectedEntry)
      fetchData(selectedEntry);
  }, [setBloodGlucoseLevels, db, selectedEntry]);


  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = (entry) => {
    if (entry) {
      console.log(entry)
      setSelectedEntry(entry);
    }
    setIsOpen(false);
  };

  let content;
  if (selectedEntry && bloodGlucoseLevels)
    content = (
      <>
        <div className={classes.header}>
          <ListItemText className={classes.headerTime}>
            <time dateTime={selectedEntry.date.toISOString()}>
              {timeFormatter.format(selectedEntry.date)}
            </time>
          </ListItemText>
          <ListItemText>
            {selectedEntry.description}
          </ListItemText>
        </div>
        <EntryGraph
          className={classes.grahpSelector}
          bloodGlucoseLevels={bloodGlucoseLevels}
          entry={selectedEntry}
        />
      </>
    );
  else
    content = (
      <div
        className={classes.grahpSelectorPlaceholder}
      >
        {children}
      </div>
    );

  return (
    <>
      <ListItem button onClick={handleOpenDialog} className={classes.cardButton}>
        {content}
      </ListItem>
      <GraphSelectorDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        title={"Select Graph"}
        entries={entries}
        selectedEntry={selectedEntry}
      />
    </>
  );
}
