import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { useFirebase } from "../firebase";
import get from "lodash/get";

const ConnectionFailureView = () => {
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

export default ConnectionFailureView;
