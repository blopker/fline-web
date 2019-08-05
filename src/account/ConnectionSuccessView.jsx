import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { useFirebase } from "../firebase";

const ConnectionSuccessView = () => {
  const { closeAccountDialog } = useFirebase();

  return (
    <Container>
      <Box textAlign="center" marginTop={5} fontSize="h5.fontSize">
        Success!{" "}
        <span role="img" aria-label="Applause">
          👏
        </span>
      </Box>

      <Box textAlign="center" marginTop={1} fontSize="body1.fontSize">
        You can update your account info anytime in the menu.
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

export default ConnectionSuccessView;
