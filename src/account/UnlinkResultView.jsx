import React from "react";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { useFirebase } from "../firebase";
import get from "lodash/get";

const UnlinkSuccessView = () => {
  const { clearAccountInfo } = useFirebase();

  return (
    <Container>
      <Box textAlign="center" marginTop={5} fontSize="h5.fontSize">
        Success!{" "}
        <span role="img" aria-label="Applause">
          👏
        </span>
      </Box>

      <Box textAlign="center" marginTop={1} fontSize="body1.fontSize">
        Your account has been unlinked.
      </Box>

      <Box textAlign="center" marginTop={4}>
        <Link
          to="/account"
          onClick={clearAccountInfo}
          style={{ textDecoration: "none" }}
        >
          <Button variant="contained" color="primary">
            Go to Account
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

const UnlinkFailureView = () => {
  const { accountInfo, clearAccountInfo } = useFirebase();
  const errorCode = get(accountInfo, "error.code", "Unknown error");

  return (
    <Container>
      <Box textAlign="center" marginTop={5} fontSize="h5.fontSize">
        Oops! Something went wrong.{" "}
        <span role="img" aria-label="Fearful face">
          😨
        </span>
      </Box>
      <Box textAlign="center" marginTop={2} fontSize="body1.fontSize">
        We couldn't unlink your account at this time.
        <br />
        Error Code: <strong>{errorCode}</strong>
      </Box>
      <Box textAlign="center" marginTop={4}>
        <Link
          to="/log"
          onClick={clearAccountInfo}
          style={{ textDecoration: "none" }}
        >
          <Button variant="contained" color="primary">
            Go to Account
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

const UnlinkResultView = props => {
  const { accountInfo } = useFirebase();

  if (accountInfo.error) {
    return <UnlinkFailureView />;
  }

  return <UnlinkSuccessView />;
};

export default UnlinkResultView;
