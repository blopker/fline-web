import React, { useState, /*useEffect*/ } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
    height: 224,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

export default function GraphSelector(props) {
  const classes = useStyles();
  const db = useDatabase();

  const { entries, children, onSelected } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState();
  const [bloodGlucoseLevels, setBloodGlucoseLevels] = useState();

  /*useEffect(() => {
    const fetchData = async (selectedEntry) => {
      const result = await db.getBloodGlucoseLevelsForLogEntry(selectedEntry);
      setBloodGlucoseLevels(result);
      onSelected({
        selectedEntry,
        result
      })
    };
    if (selectedEntry)
      fetchData(selectedEntry);
  }, [setBloodGlucoseLevels, db, selectedEntry, onSelected]);*/


  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = async (entry) => {
    setIsOpen(false);
    if (entry) {
      console.log(entry)
      setSelectedEntry(entry);
      const result = await db.getBloodGlucoseLevelsForLogEntry(entry);
      setBloodGlucoseLevels(result);
      onSelected({
        entry,
        bloodGlucoseLevels: result
      })
    }
  };

  let content;
  if (selectedEntry && bloodGlucoseLevels)
    content = (
      <>
        <ListItemText>
          {selectedEntry.description}
        </ListItemText>
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
