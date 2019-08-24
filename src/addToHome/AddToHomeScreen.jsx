import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  introHeading: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    textAlign: "center"
  },
  button: {
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(6),
    "& svg": {
      position: "absolute",
      left: theme.spacing(2)
    }
  }
}));

const AddToHomeScreen = props => {
  const classes = useStyles();

  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const captureInstallPrompt = e => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    return function cleanup() {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
    };
  }, []);

  const ua = window.navigator.userAgent;

  const isMobileChrome =
    ua.indexOf("Android") > -1 &&
    /Chrome\/[.0-9]*/.test(ua) &&
    ua.indexOf("Version") === -1;

  const isMobileSafari =
    /iphone|ipod|ipad/i.test(ua) &&
    ua.indexOf("Safari") > -1 &&
    ua.indexOf("CriOS") < 0;

  const isCompatible = isMobileSafari || (isMobileChrome && installPrompt);

  console.log({
    ua,
    isMobileChrome,
    isMobileSafari,
    isCompatible
  });

  if (!isCompatible) {
    return null;
  }

  return (
    <Dialog fullScreen open>
      <Container>
        <Typography variant="h6" className={classes.introHeading}>
          <span role="img" aria-label="Pray">
            🙏
          </span>
          <span role="img" aria-label="Love">
            ❤️
          </span>
          <span role="img" aria-label="Eat">
            🥑
          </span>
        </Typography>
        <Typography variant="h6" className={classes.introHeading}>
          Your glucose discoveries await.
        </Typography>

        {isMobileChrome && (
          <Box textAlign="center" mx={4}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => installPrompt.prompt()}
              className={classes.button}
            >
              Install
            </Button>
          </Box>
        )}
      </Container>
    </Dialog>
  );
};

export default AddToHomeScreen;
