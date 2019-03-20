import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "./AppBar";
import Nav from "./Nav";
import Log from "./Log";
import Results from "./Results";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar />
      <Route exact path="/" component={Log} />
      <Route path="/results" component={Results} />
      <Nav />
    </Router>
  );
}
export default App;
