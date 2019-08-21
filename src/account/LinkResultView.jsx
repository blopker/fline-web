import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { useFirebase } from "../firebase";
import get from "lodash/get";

const LinkSuccessView = () => {
  const { user, closeAccountDialog } = useFirebase();

  return (
    <Container>
      <Box textAlign="center" marginTop={5} fontSize="h5.fontSize">
        Success!{" "}
        <span role="img" aria-label="Applause">
          👏
        </span>
      </Box>

      <Box textAlign="center" marginTop={1} fontSize="body1.fontSize">
        Data on this device has been linked to the following account:
      </Box>

      <Box textAlign="center" marginTop={4} fontSize="h6.fontSize">
        {user.email}
      </Box>

      <Box textAlign="center" marginTop={4} fontSize="body1.fontSize">
        Your can update your account info anytime in the menu.
      </Box>

      <Box textAlign="center" marginTop={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={closeAccountDialog}
        >
          Back to home
        </Button>
      </Box>
    </Container>
  );
};

const LinkFailureView = () => {
  const { accountDialogInfo, closeAccountDialog } = useFirebase();
  const errorCode = get(accountDialogInfo, "error.code", "Unknown error");

  return (
    <Container>
      <Box textAlign="center" marginTop={5} fontSize="h5.fontSize">
        Oops! Something went wrong.{" "}
        <span role="img" aria-label="Fearful face">
          😨
        </span>
      </Box>
      <Box textAlign="center" marginTop={2} fontSize="body1.fontSize">
        We couldn't connect your account at this time.
        <br />
        Error Code: <strong>{errorCode}</strong>
      </Box>
      <Box textAlign="center" marginTop={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={closeAccountDialog}
        >
          Back to home
        </Button>
      </Box>
    </Container>
  );
};

const LinkResultView = props => {
  const { accountDialogInfo } = useFirebase();

  if (accountDialogInfo.error) {
    return <LinkFailureView />;
  }

  return <LinkSuccessView />;
};

export default LinkResultView;
