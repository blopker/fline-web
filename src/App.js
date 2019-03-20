import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import AppBar from "./AppBar";
import Nav from "./Nav";
import Log from "./Log";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar />
      <Log />
      <Nav />
    </React.Fragment>
  );
}
export default App;
