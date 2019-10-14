import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import EntryGraph from "../../log/EntryGraph";
import GraphSelectorDialog from "./GraphSelectorDialog"; 
import { useDatabase } from "../../databaseContext";

const useStyles = makeStyles(theme => ({
  cardButton: {
    display: "block",
    width: "100%"
  },
  grahpSelector: {
    height: 180
  },
  grahpSelectorPlaceholder: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
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
      <EntryGraph
        className={classes.grahpSelector}
        bloodGlucoseLevels={bloodGlucoseLevels}
        entry={selectedEntry}
      />
    );
  else
    content = (
      <div
        className={`${classes.grahpSelectorPlaceholder} ${classes.grahpSelector}`}
      >
        {children}
      </div>
    );

  return (
    <>
      <ButtonBase onClick={handleOpenDialog} className={classes.cardButton}>
        {content}
      </ButtonBase>
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
