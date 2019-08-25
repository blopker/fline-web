import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import MobileSafariBalloon from "./MobileSafariBalloon";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(8),

    textAlign: "center"
  }
}));

const MobileChromeView = props => {
  const [wasInstalled, setWasInstalled] = useState(false);
  const { installPrompt } = props;
  const handleInstallClick = () => {
    installPrompt.prompt().then(choice => {
      if (choice.outcome === "accepted") {
        setWasInstalled(true);
      }
    });
  };

  if (!installPrompt || wasInstalled) {
    return (
      <Box textAlign="center" mx={4}>
        Please launch Fline from your device's home screen.
      </Box>
    );
  }

  return (
    <Box textAlign="center" mx={4} marginTop={4}>
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleInstallClick}
      >
        Install
      </Button>
    </Box>
  );
};

const MobileSafariView = props => {
  return (
    <Box textAlign="center" marginTop={4}>
      Arrow image goes here
      <MobileSafariBalloon />
    </Box>
  );
};

const AddToHomeScreen = props => {
  const classes = useStyles();

  const [installPrompt, setInstallPrompt] = useState(null);

  // Intercept the add to home screen prompt
  useEffect(() => {
    const captureInstallPrompt = e => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Save the prompt so it can be displayed when the user wants
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
    /iphone|ipod/i.test(ua) &&
    ua.indexOf("Safari") > -1 &&
    ua.indexOf("CriOS") < 0;

  const isCompatible = isMobileSafari || isMobileChrome;

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
      <Container className={classes.container}>
        <Typography variant="h5" paragraph>
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
        <Typography variant="h5">
          Your glucose discoveries
          <br />
          await.
        </Typography>
        {isMobileChrome && <MobileChromeView installPrompt={installPrompt} />}
        {isMobileSafari && <MobileSafariView />}
      </Container>
    </Dialog>
  );
};

export default AddToHomeScreen;
