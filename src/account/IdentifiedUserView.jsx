import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { useFirebase } from "../firebase";

const IdentifiedUserView = () => {
  const { user, closeAccountDialog } = useFirebase();
  let { email } = user;

  return (
    <Container>
      <Box textAlign="center" marginTop={5} fontSize="body1.fontSize">
        Data on this device has been linked to the following account:
      </Box>

      <Box textAlign="center" marginTop={2} fontSize="h6.fontSize">
        {email}
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

export default IdentifiedUserView;
