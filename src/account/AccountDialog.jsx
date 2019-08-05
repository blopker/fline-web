import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { useFirebase } from "../firebase";
import AnonymousUserView from "./AnonymousUserView";
import IdentifiedUserView from "./IdentifiedUserView";
import ConnectionSuccessView from "./ConnectionSuccessView";
import ConnectionFailureView from "./ConnectionFailureView";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  heading: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
    textAlign: "center"
  },
  button: {
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(6),
    "& svg": {
      position: "absolute",
      left: theme.spacing(2)
    }
  },
  terms: {
    position: "absolute",
    left: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(4),
    textAlign: "center"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} unmountOnExit {...props} />;
});

const AccountDialog = props => {
  const classes = useStyles();
  const { user, accountDialogInfo, closeAccountDialog } = useFirebase();

  if (!user) {
    // Don't do anything if Firebase hasn't initialized the auth user
    return null;
  }

  let view;
  if (accountDialogInfo.redirectResult) {
    // The dialog was opened via a redirect back to the app after successfully
    // connecting to an identity provider
    view = <ConnectionSuccessView />;
  } else if (accountDialogInfo.error) {
    // Dialog opened via redirect but failed to connect to a provider
    view = <ConnectionFailureView />;
  } else if (user.email) {
    // User manually opened the dialog from the menu and has previously provided
    // their email address
    view = <IdentifiedUserView />;
  } else {
    view = <AnonymousUserView />;
  }

  return (
    <Dialog
      fullScreen
      open={accountDialogInfo.isOpen}
      onClose={closeAccountDialog}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closeAccountDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Account
          </Typography>
          <Button color="inherit" onClick={closeAccountDialog}>
            Done
          </Button>
        </Toolbar>
      </AppBar>
      {view}
    </Dialog>
  );
};

export default AccountDialog;
