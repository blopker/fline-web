import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import ArrowForward from "@material-ui/icons/ArrowForwardIos";
import ExploreIcon from "@material-ui/icons/Explore";
import { isSameDay, addDays } from "date-fns";

const styles = theme => ({
  spacer: theme.mixins.toolbar
});

const ExploreLink = React.forwardRef((props, ref) => (
  <Link to="/log/explore" innerRef={ref} {...props} />
));

function ButtonAppBar(props) {
  function onNextDate() {
    props.setDate(date => addDays(date, 1));
  }

  function onPrevDate() {
    props.setDate(date => addDays(date, -1));
  }

  const { date, menu, classes } = props;

  const formattedDate = isSameDay(date, new Date())
    ? "Today"
    : date.toLocaleDateString("en-US");

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {menu}
          <Box
            display="flex"
            flexGrow={1}
            justifyContent="center"
            alignItems="center"
            fontSize="h6.fontSize"
          >
            <IconButton onClick={onPrevDate} aria-label="Previous Date">
              <ArrowBack viewBox="0 0 16 24" />
            </IconButton>
            <Box minWidth="10ch" textAlign="center">
              <Typography variant="h6">{formattedDate}</Typography>
            </Box>
            <IconButton onClick={onNextDate} aria-label="Next Date">
              <ArrowForward />
            </IconButton>
          </Box>
          <IconButton aria-label="Explore" component={ExploreLink}>
            <ExploreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Add a dummy spacer so page content is not covered up by the AppBar */}
      <div className={classes.spacer} />
    </>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  menu: PropTypes.node.isRequired,
  setDate: PropTypes.func.isRequired
};

export default withStyles(styles)(ButtonAppBar);
