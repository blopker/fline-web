import Dexie from "dexie";
import { exportDB } from "dexie-export-import";

const db = new Dexie("Fline");

// Version declarations should be listed in ascending order, otherwise upgrades
// will fail. Keep previous version declarations around as long as there are
// users out there with that version running.

db.version(1).stores({
  days: "&key",
  settings: "&key"
});

// Version 2 splits up the `day` object store into separate `logEntries` and
// `bloodGlucoseLevels` stores that have an index on their date property
db.version(2)
  .stores({
    logEntries: "++id, date, *tags",
    bloodGlucoseLevels: "&date"
  })
  .upgrade(async tx => {
    // Split out day.value into logEntries and bloodGlucoseLevels
    const logEntries = [];
    const bloodGlucoseLevels = [];
    const days = await tx.days.toArray();

    for (const { key, value } of days) {
      const day = new Date(key);
      const migratedEntries = value.events.map(e => {
        const entry = {
          date: new Date(e.time),
          description: e.event,
          tags: []
        };
        // Verify the integrity of the entry date, there was a bug where some
        // events were created with the correct time but for the wrong day
        entry.date.setFullYear(
          day.getFullYear(),
          day.getMonth(),
          day.getDate()
        );
        return entry;
      });

      const migratedGlucoseLevels = value.graph.map(d => ({
        date: new Date(d.x),
        level: d.y
      }));

      logEntries.push(...migratedEntries);
      bloodGlucoseLevels.push(...migratedGlucoseLevels);
    }

    await tx.logEntries.bulkAdd(logEntries);
    await tx.bloodGlucoseLevels.bulkAdd(bloodGlucoseLevels);
  });

db.logEntries.defineClass({
  id: Number,
  date: Date,
  description: String,
  tags: Array
});

db.bloodGlucoseLevels.defineClass({
  date: Date,
  level: Number
});

async function markDirty() {
  // When was the data last updated?
  await db.settings.put({ key: "lastChanged", date: new Date() });
}

db.logEntries.hook("updating", function() {
  setTimeout(markDirty, 100);
});
db.logEntries.hook("creating", function() {
  setTimeout(markDirty, 100);
});
db.bloodGlucoseLevels.hook("creating", function() {
  setTimeout(markDirty, 100);
});
db.bloodGlucoseLevels.hook("updating", function() {
  setTimeout(markDirty, 100);
});

async function exportData() {
  return await exportDB(db, {
    prettyJson: true
  });
}

export { db, exportData };
