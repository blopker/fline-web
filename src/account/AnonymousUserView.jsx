import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useFirebase } from "../firebase";
import FacebookIcon from "./FacebookIcon";
import GoogleIcon from "./GoogleIcon";

const useStyles = makeStyles(theme => ({
  introHeading: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
    textAlign: "center"
  },
  button: {
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(6),
    "& svg": {
      position: "absolute",
      left: theme.spacing(2)
    }
  },
  termsOfService: {
    position: "absolute",
    left: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(4),
    textAlign: "center"
  }
}));

const AnonymousUserView = () => {
  const classes = useStyles();
  const { fb, user } = useFirebase();

  const handleConnectGoogleClick = e => {
    const googleAuth = new fb.app.auth.GoogleAuthProvider();
    googleAuth.addScope("profile");
    googleAuth.addScope("email");
    sessionStorage.setItem("firebaseLinkAccountWorkflowStarted", Date.now());
    user.linkWithRedirect(googleAuth);
  };

  const handleConnectFacebookClick = e => {
    const facebookAuth = new fb.app.auth.FacebookAuthProvider();
    facebookAuth.addScope("email");
    sessionStorage.setItem("firebaseLinkAccountWorkflowStarted", Date.now());
    user.linkWithRedirect(facebookAuth);
  };

  return (
    <Container>
      <Typography variant="h6" className={classes.introHeading}>
        Hi{" "}
        <span role="img" aria-label="Waving Hand">
          👋
        </span>
        <br />
        Tell us who you are so we can send you results.
      </Typography>

      <Box textAlign="center" mx={4}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleConnectGoogleClick}
          className={classes.button}
        >
          <GoogleIcon />
          Connect Google
        </Button>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleConnectFacebookClick}
          className={classes.button}
        >
          <FacebookIcon />
          Connect Facebook
        </Button>
      </Box>

      <Typography variant="body2" className={classes.termsOfService}>
        Tap "Connect" above to accept Fline's Terms of Service and Privacy
        Policy.
      </Typography>
    </Container>
  );
};

export default AnonymousUserView;
