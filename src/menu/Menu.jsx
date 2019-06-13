import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import download from "downloadjs";

const styles = {
  list: {
    width: 250
  }
};

function AppMenu(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dbDump, setDbDump] = useState();
  const toggleDrawer = open => () => {
    setDbDump();
    setIsOpen(open);
    if (open) {
      dumpDB();
    }
  };

  function dumpDB() {
    // Dump the db and enable the export button when done.
    // We have to dump the database optimistically when the menu opens because
    // the Web Share API wont work if triggered async, e.g. in a promise.
    props.export().then(blob => {
      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        setDbDump(reader.result);
      });
      reader.readAsText(blob);
    });
  }

  function exportAction() {
    if (navigator.share) {
      // Use Web Share API if on mobile web
      navigator
        .share({
          text: dbDump
        })
        .catch(error => console.log("Error sharing", error));
    } else {
      // Just download the file otherwise
      const fileName = `fline-export-${new Date().toISOString()}.json`;
      download(dbDump, fileName, "application/json");
    }
  }

  function refreshAction() {
    window.location.reload(true);
  }

  const { classes } = props;
  const version = (process.env.REACT_APP_COMMIT_REF || "dev").slice(0, 7);

  const sideList = (
    <div className={classes.list}>
      <List>
        <ListItem button key="0" onClick={exportAction} disabled={!!!dbDump}>
          <ListItemText primary="Export data for all days" />
        </ListItem>
        <ListItem button key="1" onClick={refreshAction}>
          <ListItemText primary="Reload" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key="100">
          <ListItemText primary={`Version: ${version}`} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={isOpen} onClose={toggleDrawer(false)}>
        {sideList}
      </Drawer>
    </>
  );
}

AppMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  export: PropTypes.func.isRequired
};

export default withStyles(styles)(AppMenu);
