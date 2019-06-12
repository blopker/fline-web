import React, { useCallback, memo } from "react";
import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import orange from "@material-ui/core/colors/orange";

const ExploreListItem = props => {
  const { entry, isChecked, isHighlighted, onCheckToggle, onClick } = props;

  const handleCheckToggle = useCallback(() => {
    onCheckToggle(entry.id);
  }, [entry, onCheckToggle]);

  const handleClick = useCallback(() => {
    onClick(entry.id);
  }, [entry, onClick]);

  return (
    <ListItem button divider onClick={handleClick} selected={isHighlighted}>
      <ListItemText
        primary={entry.description}
        style={{ color: isHighlighted ? orange[500] : null }}
      />
      <ListItemSecondaryAction>
        <Checkbox edge="end" onChange={handleCheckToggle} checked={isChecked} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

ExploreListItem.propTypes = {
  entry: PropTypes.object.isRequired,
  isChecked: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onCheckToggle: PropTypes.func.isRequired
};

export default memo(ExploreListItem);
