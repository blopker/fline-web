import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const ErrorScreen = props => {
  return (
    <>
      <AppBar>
        <Toolbar>{props.menu}</Toolbar>
      </AppBar>
      <Box marginTop={12} paddingLeft={2} paddingRight={2}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          <Typography variant="h6" paragraph>
            Oops! Something went wrong.{" "}
            <span role="img" aria-label="Fearful face">
              😨
            </span>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload(true)}
          >
            Reload
          </Button>
        </Grid>
      </Box>
    </>
  );
};

ErrorScreen.propTypes = { menu: PropTypes.node.isRequired };

export default ErrorScreen;
