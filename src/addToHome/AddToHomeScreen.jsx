import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import MobileSafariBalloon from "./MobileSafariBalloon";
import DownArrowDoodle from "./DownArrowDoodle";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(8),
    textAlign: "center"
  }
}));

// The Safari view displays a tooltip indicating that the user needs to tap
// the share button in order to add the app to the home screen.
const MobileSafariView = props => {
  return (
    <Box textAlign="center" marginTop={8}>
      <DownArrowDoodle style={{ width: 128, height: 128 }} />
      <MobileSafariBalloon />
    </Box>
  );
};

// The Chrome view opens up a built-in modal dialog, asking the user to to add
// the app to their home screen.
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
        color="primary"
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

// The <AddToHomeScreen> Screen notifies the user that the app should be
// installed. It provides varying install instructions depending on what browser
// the user is actively running.
const AddToHomeScreen = props => {
  const classes = useStyles();
  const [installPrompt, setInstallPrompt] = useState(null);

  // Intercept and save a reference to Chrome's built-in Add2Home prompt
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
    /iphone|ipod/i.test(ua) &&
    ua.indexOf("Safari") > -1 &&
    ua.indexOf("CriOS") < 0;

  const isCompatible = isMobileSafari || isMobileChrome;

  // Don't promote adding to the home screen to non-compatible browsers.
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
