import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "./AppBar";
import Nav from "./Nav";
import Log from "./Log";
import Results from "./Results";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Theme from "./Theme";

function App() {
  const [date, setDate] = useState(new Date());
  return (
    <Router>
      <Theme>
        <CssBaseline />
        <AppBar setDate={setDate} date={date} />
        <Route exact path="/" component={() => <Log />} />
        <Route path="/results" component={Results} />
        <Nav />
      </Theme>
    </Router>
  );
}
export default App;
