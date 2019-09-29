import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { useFirebase } from "../firebase";
import red from "@material-ui/core/colors/red";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const IdentifiedUserView = () => {
  const { user, fb } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);

  const kickOffDeleteAccountWorkflow = () => {
    setIsLoading(true);

    // Figure out who the user's auth provider is
    let userAuthProvider;
    const userAuthProviderId = user.providerData[0].providerId;
    const googleAuth = new fb.app.auth.GoogleAuthProvider();
    const facebookAuth = new fb.app.auth.FacebookAuthProvider();

    if (userAuthProviderId === googleAuth.providerId) {
      userAuthProvider = googleAuth;
    } else if (userAuthProviderId === facebookAuth.providerId) {
      userAuthProvider = facebookAuth;
    }

    // Set a flag to delete this user after they have passed a credentials check
    sessionStorage.setItem("firebaseDeleteAccountWorkflowStarted", Date.now());
    user.reauthenticateWithRedirect(userAuthProvider);
  };

  const openUnlinkDialog = () => setShowUnlinkDialog(true);
  const closeUnlinkDialog = () => setShowUnlinkDialog(false);

  return (
    <>
      <Container>
        <Box textAlign="center" marginTop={5} fontSize="body1.fontSize">
          Data on this device has been linked to the following email address:
        </Box>

        <Box textAlign="center" marginTop={2} fontSize="h6.fontSize">
          {user.email}
        </Box>

        <Box textAlign="center" marginTop={6} color={red[500]}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              onClick={openUnlinkDialog}
            >
              Unlink Account
            </Button>
          )}
        </Box>
      </Container>
      <Dialog
        open={showUnlinkDialog}
        onClose={closeUnlinkDialog}
        aria-labelledby="unlink-dialog-title"
        aria-describedby="unlink-dialog-description"
      >
        <DialogTitle id="unlink-dialog-title">
          Are you sure you want to unlink your account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="unlink-dialog-description">
            You will be asked to provide your credentials on the next screen to
            proceed with unlinking.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUnlinkDialog}>Cancel</Button>
          <Button onClick={kickOffDeleteAccountWorkflow}>Unlink Account</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IdentifiedUserView;
