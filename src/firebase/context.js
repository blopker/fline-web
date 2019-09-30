import React, { useState, useRef, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as Sentry from "@sentry/browser";

const FirebaseContext = React.createContext();

function FirebaseProvider(props) {
  const { fb } = props;
  const [user, initializing, error] = useAuthState(fb.auth);
  const alreadyProcessedRedirectResult = useRef(false);
  const [accountInfo, setAccountInfo] = useState({
    redirectResult: null,
    error: null
  });

  const clearAccountInfo = useCallback(
    () => setAccountInfo({}),
    [setAccountInfo]
  );

  if (error) {
    Sentry.captureException(error);
  }
  // If user isn't logged in already, make them an Anon user
  if (!user && !initializing) {
    fb.auth.signInAnonymously().catch(function(error) {
      Sentry.captureException(error);
    });
  }

  // Process any ongoing authentication provider account linking or
  // unlinking flow. After the OAuth provider has redirected back to the app,
  // bring up the Account which will display either a success or error
  // message depending on the current workflow.
  if (user && !alreadyProcessedRedirectResult.current) {
    alreadyProcessedRedirectResult.current = true;

    const isLinkingAccount = sessionStorage.getItem(
      "firebaseLinkAccountWorkflowStarted"
    );
    const isDeletingAccount = sessionStorage.getItem(
      "firebaseDeleteAccountWorkflowStarted"
    );
    sessionStorage.removeItem("firebaseLinkAccountWorkflowStarted");
    sessionStorage.removeItem("firebaseDeleteAccountWorkflowStarted");

    if (isLinkingAccount) {
      fb.auth
        .getRedirectResult()
        .then(redirectResult => {
          if (redirectResult.user !== null) {
            setAccountInfo({ view: "LinkResultView" });
          }
        })
        .catch(error => {
          setAccountInfo({
            view: "LinkResultView",
            error
          });
          Sentry.captureException(error);
          console.error(error);
        });
    } else if (isDeletingAccount) {
      fb.auth
        .getRedirectResult()
        .then(redirectResult => {
          if (redirectResult.user !== null) {
            return user.delete().then(() => {
              setAccountInfo({
                view: "UnlinkResultView"
              });
            });
          }
        })
        .catch(error => {
          setAccountInfo({
            view: "UnlinkResultView",
            error
          });
          Sentry.captureException(error);
          console.error(error);
        });
    }
  }

  const contextValue = {
    fb,
    user,
    initializing,
    accountInfo,
    clearAccountInfo
  };
  return <FirebaseContext.Provider value={contextValue} {...props} />;
}

export { FirebaseContext, FirebaseProvider };
