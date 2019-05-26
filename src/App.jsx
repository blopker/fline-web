import React, { Suspense, lazy, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { startOfDay } from "date-fns";
import Theme from "./Theme";
import LogScreen from "./log/LogScreen";
import { DatabaseProvider } from "./databaseContext";
import AppMenu from "./menu/Menu";
import { exportData } from "./db";

const DigitizerTest = lazy(() => import("./testDigitizer/DigitizerTest"));

function App(props) {
  const { db } = props;

  // The selected date the LogScreen is displaying
  const [date, setDate] = useState(() => {
    const initialState = startOfDay(new Date());
    return initialState;
  });

  const menu = <AppMenu export={exportData} />;

  return (
    <Theme>
      <CssBaseline />
      <DatabaseProvider db={db}>
        <Suspense fallback={<div>Loading...</div>}>
          <Router>
            <Switch>
              <Route
                path="/log"
                render={routeProps => (
                  <LogScreen
                    date={date}
                    setDate={setDate}
                    routeProps={routeProps}
                    menu={menu}
                  />
                )}
              />
              <Route exact path="/test" render={() => <DigitizerTest />} />
              <Redirect to="/log" />
            </Switch>
          </Router>
        </Suspense>
      </DatabaseProvider>
    </Theme>
  );
}
export default App;