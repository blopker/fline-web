import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as Sentry from "@sentry/browser";

const FirebaseContext = React.createContext();

function FirebaseProvider(props) {
  const { fb } = props;
  const [user, initialising, error] = useAuthState(fb.auth);
  if (error) {
    Sentry.captureException(error);
  }
  if (user && !user.email) {
    user.updateEmail(`user@${window.location.hostname}`);
  }
  // If user isn't logged in already, make them an Anon user
  if (!user && !initialising) {
    fb.auth.signInAnonymously().catch(function(error) {
      Sentry.captureException(error);
    });
  }
  const contextValue = {
    fb: fb,
    user: user
  };
  return <FirebaseContext.Provider value={contextValue} {...props} />;
}

export { FirebaseContext, FirebaseProvider };
