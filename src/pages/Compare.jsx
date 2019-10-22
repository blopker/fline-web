import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import GraphSelector from "../components/compare/GraphSelector";
import GraphsPreview from "../components/compare/GraphsPreview";
import { useDatabase } from "../databaseContext";


const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center'
  }
}));


function openDownloadURL() {
  var svgNode = document.getElementById('graph-preview');
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = svgNode.clientWidth;
  canvas.height = svgNode.clientHeight;

  var svgString = new XMLSerializer().serializeToString(svgNode);
  var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

  var DOMURL = window.self.URL || window.self.webkitURL || window.self;
  var url = DOMURL.createObjectURL(svg);

  var image = new Image();
  image.onload = function() {
      ctx.drawImage(image, 0, 0);
      var png = canvas.toDataURL("image/png");
      var link = document.createElement('a');
      link.href = png;
      link.download = 'compare.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      DOMURL.revokeObjectURL(png);
  };
  image.src = url;
}

export default function Compare() {
  const classes = useStyles();
  const db = useDatabase();

  const [logEntries, setLogEntries] = useState();
  const [firstSelected, setFirstSelected] = useState();
  const [secondSelected, setSecondSelected] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await db.getLogEntries();
      setLogEntries(result);
    };
    fetchData();
  }, [setLogEntries, db]);

  const handleFirstSelected = (result) => {
    console.log(result)
    setFirstSelected(result);
  };

  const handleSecondSelected = (result) => {
    console.log(result)
    setSecondSelected(result);
  };

  let actions;
  if (firstSelected && secondSelected) {
    actions = (
      <Paper className={classes.paper}>
        <Typography variant="h5">Preview</Typography>
        <GraphsPreview
          firstGraph={firstSelected}
          secondGraph={secondSelected}
        />
        <CardActions disableSpacing>
          <Button variant="outlined" fullWidth size="large" onClick={openDownloadURL}>
            Save to Camera Roll
          </Button>
        </CardActions>
      </Paper>
    );
  }

  return (
    <Container maxWidth="md"  className={classes.container}>
      <Card>
        <List dense>
          <GraphSelector entries={logEntries} onSelected={handleFirstSelected}>Tap to select first graph</GraphSelector>
          <GraphSelector entries={logEntries} onSelected={handleSecondSelected}>Tap to select second graph</GraphSelector>
        </List>
        {actions}
      </Card>
    </Container>
  );
}
