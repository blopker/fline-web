import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "../firebase";
import AnonymousUserView from "../account/AnonymousUserView";
import IdentifiedUserView from "../account/IdentifiedUserView";
import LinkResultView from "../account/LinkResultView";
import UnlinkResultView from "../account/UnlinkResultView";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
    spinner: {
      alignSelf: "center",
      marginTop: theme.spacing(4)
    }
  }));

function Account() {
  const classes = useStyles();
  const {
    user,
    accountInfo
  } = useFirebase();

  let view;

  if (!user) {
    // Don't show anything if Firebase hasn't initialized the auth user
    view = <CircularProgress className={classes.spinner} />;
  } else if (accountInfo.view === "LinkResultView") {
    // The account was opened via a redirect back to the app after attempting to
    // link to an identity provider.
    view = <LinkResultView />;
  } else if (accountInfo.view === "UnlinkResultView") {
    // Account opened via redirect after attempting to delete/unlink a user
    view = <UnlinkResultView />;
  } else if (user.email) {
    // User manually opened the Account from the menu and has previously provided
    // their email address
    view = <IdentifiedUserView />;
  } else {
    // User manually opened the Account and has no email on record
    view = <AnonymousUserView />;
  }

  return (
    <div>{view}</div>
  );
}

export default Account;
