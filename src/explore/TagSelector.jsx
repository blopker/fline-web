import React, { useCallback, memo } from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(
  theme => ({
    scrollingHorizontalList: {
      padding: theme.spacing(1),
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      "&::after": {
        content: "''",
        flex: "none",
        width: theme.spacing(4)
      }
    },
    chip: {
      margin: theme.spacing(0.5)
    },
    addTransparentBorder: {
      border: "solid 1px transparent"
    }
  }),
  { name: "TagSelector" }
);

const TagSelector = props => {
  const { tags, selectedTag, onChange } = props;
  const classes = useStyles();

  const handleChipClick = useCallback(
    e => {
      const clickedTag = e.currentTarget.textContent;
      if (!clickedTag) return;
      onChange(clickedTag);
    },
    [onChange]
  );

  return (
    <div className={classes.scrollingHorizontalList}>
      {tags.map(currentTag => (
        <Chip
          key={currentTag}
          label={currentTag}
          aria-label={currentTag}
          className={classes.chip}
          onClick={handleChipClick}
          variant={selectedTag === currentTag ? "default" : "outlined"}
          color={selectedTag === currentTag ? "secondary" : "default"}
          classes={{ colorSecondary: classes.addTransparentBorder }}
        />
      ))}
    </div>
  );
};

TagSelector.propTypes = {
  tags: PropTypes.array.isRequired,
  selectedTag: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default memo(TagSelector);
