import React, { Suspense, lazy, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import CircularProgress from "@material-ui/core/CircularProgress";
import { startOfDay } from "date-fns";
import Theme from "./Theme";
import LogScreen from "./log/LogScreen";
import { DatabaseProvider } from "./databaseContext";
import AppMenu from "./menu/Menu";
import { exportData } from "./db";
import { FirebaseProvider } from "./firebase";
import ErrorBoundary from "./common/ErrorBoundary";
import ErrorScreen from "./error/ErrorScreen";
import AddToHomeScreen from "./addToHome/AddToHomeScreen";

import Account from "./pages/Account";
import { useFirebase } from "./firebase";


const DigitizerTest = lazy(() => import("./testDigitizer/DigitizerTest"));

const useStyles = makeStyles(theme => ({
  spinner: {
    position: 'fixed',
    top: '50%',
    left: '50%',
  }
}));

function PrivateRoute({ component: Component, ...rest }) {
  const { user, initializing } = useFirebase();
  const classes = useStyles();

  return (
    <Route
      {...rest}
      render={props => 
        user && user.email ? (
          <Component {...props} />
        ) : (
          !initializing ? (
            <Redirect
              to={{
                pathname: "/account",
                state: { from: props.location }
              }}
            />
          ) : (
            <CircularProgress className={classes.spinner} />
          )
        )
      }
    />
  );
}

function App(props) {
  const { db, fb } = props;

  // The selected date the LogScreen is displaying
  const [date, setDate] = useState(() => {
    const initialState = startOfDay(new Date());
    return initialState;
  });

  const menu = <AppMenu export={exportData} />;

  const launchedFromHomeScreen =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && window.navigator.standalone);

  return (
    <Theme>
      <CssBaseline />
      <DatabaseProvider db={db}>
        <FirebaseProvider fb={fb}>
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<ErrorScreen menu={menu} />}>
              {!launchedFromHomeScreen && <AddToHomeScreen />}

              <Router>
                <Switch>
                  <Route exact path="/test" render={() => <DigitizerTest />} />
                  <Route exact path="/account" render={() => <Account />} />
                  <PrivateRoute
                    path="/log"
                    component={props => (
                      <LogScreen
                        date={date}
                        setDate={setDate}
                        menu={menu}
                        routeProps={props}
                      />
                    )}
                  />
                  <Redirect to="/log" />
                </Switch>
              </Router>
            </ErrorBoundary>
          </Suspense>
        </FirebaseProvider>
      </DatabaseProvider>
    </Theme>
  );
}
export default App;
