import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';


const SlideUp = React.forwardRef((props, ref) => (
  <Slide unmountOnExit direction="up" ref={ref} {...props} />
));

export default function GraphSelectorDialog(props) {
  const { isOpen, onClose, title, entries, selectedEntry } = props;

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={() => onClose()}
      TransitionComponent={SlideUp}
    >
      <AppBar position="sticky">
        <Toolbar>
          <IconButton color="inherit" onClick={() => onClose()} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <List>
        {entries && entries.map(entry => (
          <MenuItem button key={entry.id} onClick={() => onClose(entry)} selected={selectedEntry && entry.id === selectedEntry.id}>
            <ListItemText primary={entry.description} secondary={entry.date.toLocaleDateString("en-US", { day: 'numeric', month: 'numeric', year: 'numeric' })}/>
          </MenuItem>
        ))}
      </List>
    </Dialog>
  );
}
