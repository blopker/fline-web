import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Edit from "./edit/EditScreen";
import Log from "./log/LogScreen";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Theme from "./Theme";

function App() {
  const [date, setDate] = useState(new Date());
  return (
    <Router>
      <Theme>
        <CssBaseline />
        <Route
          exact
          path="/"
          component={() => <Log date={date} setDate={setDate} />}
        />
        <Route exact path="/edit" component={() => <Edit date={date} />} />
      </Theme>
    </Router>
  );
}
export default App;
