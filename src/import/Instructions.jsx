import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import dailyGraphNavMenu from "./dailyGraphNavMenu.png";
import shareDailyGraph from "./shareDailyGraph.png";

const styles = theme => ({
  paragraph: {
    margin: `${theme.spacing.unit * 3}px 0`
  },

  img: {
    width: "85%",
    maxWidth: 360
  }
});

/**
 * Displays instructions and illustrations detailing how the user can take a
 * screenshot of their glucose graph and how to import the screenshot.
 */

class Instructions extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // This component is completely static, bail out of all re-renders.
    return false;
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <Typography variant="h6" className={classes.paragraph}>
          How it works{" "}
          <span role="img" aria-label="Pointing Down">
            👇
          </span>
        </Typography>

        <Typography variant="body1" className={classes.paragraph}>
          In your LibreLink app, open the menu and go to{" "}
          <strong>Daily Graph</strong>.
        </Typography>

        <img
          src={dailyGraphNavMenu}
          className={classes.img}
          alt="Daily Graph"
        />

        <Typography variant="body1" className={classes.paragraph}>
          Tap on the blue box with the arrow.
        </Typography>

        <img src={shareDailyGraph} className={classes.img} alt="Share Icon" />

        <Typography variant="body1" className={classes.paragraph}>
          Save the image "Save image" on iPhone.
        </Typography>

        <Typography variant="body1" className={classes.paragraph}>
          That's it! Now select and upload it.
        </Typography>
      </>
    );
  }
}

export default withStyles(styles)(Instructions);
