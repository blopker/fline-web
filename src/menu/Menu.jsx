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
  const toggleDrawer = open => () => {
    setIsOpen(open);
  };

  async function exportDB() {
    const fileName = `fline-export-${new Date().toISOString()}.json`;
    const blob = await props.export();
    download(blob, fileName, "application/json");
  }

  const { classes } = props;

  const sideList = (
    <div className={classes.list}>
      <List>
        <ListItem button key="0" onClick={exportDB}>
          <ListItemText primary="Export" />
        </ListItem>
      </List>
      <Divider />
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
