import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import teal from "@material-ui/core/colors/teal";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: "dark",
    primary: indigo,
    secondary: {
      main: teal[500]
    }
  }
});

function Theme(props) {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export default Theme;
