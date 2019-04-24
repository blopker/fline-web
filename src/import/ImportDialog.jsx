import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import teal from "@material-ui/core/colors/teal";
import Instructions from "./Instructions";

const SlideUp = props => <Slide direction="up" {...props} />;

const styles = theme => ({
  section: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    textAlign: "center"
  },

  input: {
    display: "none"
  },

  button: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[500],
    "&:hover": {
      backgroundColor: teal[700]
    }
  },

  paragraph: {
    margin: `${theme.spacing.unit * 3}px 0`
  },

  img: {
    width: "85%",
    maxWidth: 360
  }
});

const ImportDialog = props => {
  const { classes, handleClose, isOpen } = props;

  // Create an invisible input file field to store a screenshot to be imported.
  const hiddenFileInputField = (
    <input
      accept="image/*"
      className={classes.input}
      id="select-image-file"
      type="file"
    />
  );

  // The Select Image button merely acts as a click on the invisible file input.
  const selectImageButton = (
    <label htmlFor="select-image-file" style={{ width: "100%" }}>
      <Button
        fullWidth={true}
        variant="contained"
        component="div"
        className={classes.button}
        size="large"
      >
        Select Image
      </Button>
    </label>
  );

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={SlideUp}
    >
      <AppBar position="sticky">
        <Toolbar>
          <IconButton color="inherit" onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Add glucose data</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <section className={classes.section}>
          {hiddenFileInputField}
          {selectImageButton}
        </section>
        <Divider />
        <section className={classes.section}>
          <Instructions />
        </section>
        <section className={classes.section}>{selectImageButton}</section>
      </main>
    </Dialog>
  );
};

ImportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired
};

export default withStyles(styles)(ImportDialog);
