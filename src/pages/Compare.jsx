import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import GraphSelector from "../components/compare/GraphSelector";
import { useDatabase } from "../databaseContext";


const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  }
}));


export default function Compare() {
  const classes = useStyles();
  const db = useDatabase();

  const [logEntries, setLogEntries] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await db.getLogEntries();
      setLogEntries(result);
    };
    fetchData();
  }, [setLogEntries, db]);

  return (
    <Container maxWidth="md"  className={classes.container}>
      <Card>
        <GraphSelector entries={logEntries}>Tap to select first graph</GraphSelector>
        <GraphSelector entries={logEntries}>Tap to select second graph</GraphSelector>
        <CardActions disableSpacing>
          <Button color="secondary">
            Save to Camera Roll
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
