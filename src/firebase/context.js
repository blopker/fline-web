import React, { useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as Sentry from "@sentry/browser";

const FirebaseContext = React.createContext();

function FirebaseProvider(props) {
  const { fb } = props;
  const [user, initializing, error] = useAuthState(fb.auth);
  const [accountDialogInfo, setAccountDialogInfo] = useState({
    isOpen: false,
    redirectResult: null,
    error: null
  });
  const alreadyProcessedRedirectResult = useRef(false);

  if (error) {
    Sentry.captureException(error);
  }
  // If user isn't logged in already, make them an Anon user
  if (!user && !initializing) {
    fb.auth.signInAnonymously().catch(function(error) {
      Sentry.captureException(error);
    });
  }

  // Handle the results of any authentication provider account linking flow.
  // If the OAuth provider has redirected back to the app, then bring up the
  // AccountDialog which will display either a success or error message.
  if (!alreadyProcessedRedirectResult.current) {
    alreadyProcessedRedirectResult.current = true;
    fb.auth
      .getRedirectResult()
      .then(redirectResult => {
        if (redirectResult.user !== null) {
          setAccountDialogInfo({ isOpen: true, redirectResult, error: null });
        }
      })
      .catch(error => {
        setAccountDialogInfo({ isOpen: true, error, redirectResult: null });
        Sentry.captureException(error);
        console.error(error);
      });
  }

  const contextValue = {
    fb,
    user,
    accountDialogInfo,
    openAccountDialog: () =>
      setAccountDialogInfo({ isOpen: true, redirectResult: null, error: null }),
    closeAccountDialog: () =>
      setAccountDialogInfo({ isOpen: false, redirectResult: null, error: null })
  };
  return <FirebaseContext.Provider value={contextValue} {...props} />;
}

export { FirebaseContext, FirebaseProvider };
