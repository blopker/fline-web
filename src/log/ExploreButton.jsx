import React, { memo, useEffect, useState, useCallback } from "react";
import Badge from "@material-ui/core/Badge";
import red from "@material-ui/core/colors/red";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import ExploreIcon from "@material-ui/icons/Explore";
import { addHours } from "date-fns";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { Link } from "react-router-dom";
import { ENTRY_TAGS } from "../constants";
import { useDatabase } from "../databaseContext";

const useStyles = makeStyles(theme => ({
  red: {
    backgroundColor: red[500]
  }
}));

const ExploreLink = React.forwardRef((props, ref) => (
  <Link to="/log/explore" innerRef={ref} {...props} />
));

const ExploreButton = props => {
  const classes = useStyles();
  const { db } = useDatabase();
  const [badgeVisible, setBadgeVisible] = useState(false);

  const dismissBadge = () => {
    if (badgeVisible) {
      db.settings.put({ key: "exploreBadgeDateDismissed", value: new Date() });
      setBadgeVisible(false);
    }
  };

  const updateBadgeIfNecessary = useCallback(
    debounce(async () => {
      // Don't show the badge if it was previously dismissed
      const dateDismissed = await db.settings.get("exploreBadgeDateDismissed");
      if (dateDismissed) {
        return;
      }

      // Find all LogEntries that are tagged, then find if there is any imported
      // blood glucose data for each of the entries
      const taggedEntries = await db.logEntries.orderBy("tags").toArray();
      await Promise.all(
        taggedEntries.map(
          async entry =>
            (entry.bloodGlucoseLevelCount = await db.bloodGlucoseLevels
              .where("date")
              .between(
                addHours(entry.date, -1),
                addHours(entry.date, 3),
                true,
                true
              )
              .count())
        )
      );

      // Count up the number of entries per tag that have blood glucose data
      const numEntriesByTag = ENTRY_TAGS.reduce((result, tag) => {
        result[tag] = 0;
        return result;
      }, {});

      for (const entry of taggedEntries) {
        if (entry.bloodGlucoseLevelCount > 1) {
          for (const tag of entry.tags) {
            numEntriesByTag[tag]++;
            // If we hit category with 2 or more entries with data, then
            // short circuit and show the red badge
            if (numEntriesByTag[tag] >= 2) {
              setBadgeVisible(true);
              return;
            }
          }
        }
      }
      // If we hit this point, then we don't have enough tagged entries with data
      setBadgeVisible(false);
    }, 1500),
    [db, setBadgeVisible]
  );

  // Attach DB listeners to trigger the badge visibility
  useEffect(() => {
    const createLogEntryListener = (primaryKey, logEntry, transaction) => {
      const createdWithTag = get(logEntry, "tags.length") > 0;
      if (createdWithTag) {
        transaction.on("complete", updateBadgeIfNecessary);
      }
    };

    const updateLogEntryListener = (
      modifications,
      primaryKey,
      logEntry,
      transaction
    ) => {
      const tagsOrDateWereModified = Object.keys(modifications).some(
        modified => modified.startsWith("tags") || modified === "date"
      );
      if (tagsOrDateWereModified) {
        transaction.on("complete", updateBadgeIfNecessary);
      }
    };

    const createBloodGlucoseLevelListener = (
      primaryKey,
      bloodGlucoseLevel,
      transaction
    ) => {
      transaction.on("complete", updateBadgeIfNecessary);
    };

    db.on("ready", updateBadgeIfNecessary);
    db.logEntries.hook("creating", createLogEntryListener);
    db.logEntries.hook("updating", updateLogEntryListener);
    db.bloodGlucoseLevels.hook("creating", createBloodGlucoseLevelListener);

    return () => {
      db.logEntries.hook("creating").unsubscribe(createLogEntryListener);
      db.logEntries.hook("updating").unsubscribe(updateLogEntryListener);
      db.bloodGlucoseLevels
        .hook("creating")
        .unsubscribe(createBloodGlucoseLevelListener);
    };
  }, [db, updateBadgeIfNecessary]);

  return (
    <IconButton
      aria-label="Explore"
      component={ExploreLink}
      onClick={dismissBadge}
    >
      <Badge
        variant="dot"
        invisible={!badgeVisible}
        classes={{ dot: classes.red }}
      >
        <ExploreIcon />
      </Badge>
    </IconButton>
  );
};

export default memo(ExploreButton);
