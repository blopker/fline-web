import React, { useContext } from "react";
import { startOfDay, endOfDay } from "date-fns";

const DatabaseContext = React.createContext();

function DatabaseProvider(props) {
  const { db } = props;

  /**
   * Writes a LogEntry to the database.
   *
   * If an entry with the same ID already exists, it will be updated. Otherwise,
   * a new entry will be added.
   *
   * @param {LogEntry} entry
   */
  const saveLogEntry = async entry => {
    await db.logEntries.put(entry);
  };

  const getLogEntriesForDay = async date => {
    return await getLogEntriesBetweenDates(startOfDay(date), endOfDay(date));
  };

  /**
   * Gets all LogEntries between two dates (inclusive).
   *
   * Entries will be returned in ascending order of date.
   *
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Array<LogEntry>}
   */

  const getLogEntriesBetweenDates = async (startDate, endDate) => {
    return await db.logEntries
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  };

  const getBloodGlucoseLevelsForDay = async date => {
    return await getBloodGlucoseLevelsBetweenDates(
      startOfDay(date),
      endOfDay(date)
    );
  };

  const getBloodGlucoseLevelsBetweenDates = async (startDate, endDate) => {
    return await db.bloodGlucoseLevels
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  };

  const saveBloodGlucoseLevels = async (date, digitizedData) => {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const formatter = ({ x, y }) => {
      const d = new Date(date);
      // Convert fractional hours into HH:MM (eg: 10.5 -> 10:30)
      d.setHours(0, 0, x * 3600, 0);
      return {
        date: d,
        level: y
      };
    };

    const newData = digitizedData.map(formatter);

    await db.transaction("rw", db.bloodGlucoseLevels, async () => {
      const oldData = db.bloodGlucoseLevels.where("date").between(start, end);
      await oldData.delete();
      await db.bloodGlucoseLevels.bulkAdd(newData);
    });
  };

  const contextValue = {
    saveLogEntry,
    getLogEntriesForDay,
    saveBloodGlucoseLevels,
    getBloodGlucoseLevelsForDay
  };

  return <DatabaseContext.Provider value={contextValue} {...props} />;
}

function useDatabase() {
  const contextValue = useContext(DatabaseContext);
  if (!contextValue) {
    throw new Error("useDatabase must be used within a <DatabaseProvider>");
  }
  return contextValue;
}

export { DatabaseProvider, useDatabase };
