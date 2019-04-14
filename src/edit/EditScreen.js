import React from "react";
import AppBar from "./AppBar";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import TimePicker from "./TimePicker";

const styles = theme => ({
  subtitle: {
    textAlign: "center"
  },
  root: {
    flexGrow: 1,
    margin: "20px"
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  textBox: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    margin: 0,
    // width: "100%",
    height: "100px"
  }
});

function _EditScreen(props) {
  const { classes } = props;
  return (
    <>
      <AppBar title="Add something" />
      <div className={classes.root}>
        <form noValidate autoComplete="off">
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography
                className={classes.paper}
                variant="subtitle1"
                gutterBottom
              >
                A meal, a feeling, a workout...
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="event-description"
                label="What happened?"
                multiline
                autoFocus={true}
                fullWidth={true}
                rowsMax="4"
                rows="4"
                className={classes.textBox}
                margin="normal"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <TimePicker />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth={true}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

let EditScreen = withStyles(styles)(_EditScreen);

export default EditScreen;
