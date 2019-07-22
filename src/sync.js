import { exportData } from "./db";
let timer;
const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_MIN = 1000 * 60;
// const ONE_DAY = 1000 * 60;
// const ONE_MIN = 1000;

async function sync(database, firebase) {
  console.log("start sync");
  if (!navigator.onLine) {
    // Not online, bail
    return;
  }

  const user = firebase.auth.currentUser;
  if (!user) {
    // No user, no sync.
    return;
  }

  const lastChanged = await database.settings.get("lastChanged");
  if (!lastChanged || !lastChanged.date) {
    // Never changed? No sync.
    return;
  }

  const lastSync = await database.settings.get("lastSync");
  if (lastSync && lastSync.date > lastChanged.date) {
    // Is the last sync time greater than the last change time? No sync.
    return;
  }

  let now = new Date();
  if (lastSync && now - lastSync.date < ONE_DAY) {
    // Has it been less than a day since we lasted synced? No sync.
    return;
  }

  // Reset last sync time first in case this fails
  await database.settings.put({ key: "lastSync", date: now });
  console.log("Syncing");
  // Dump database and upload
  const blob = await exportData();
  var metadata = {
    contentType: "application/json"
  };
  const ref = firebase.storage.ref();
  let child = ref.child(`databases/${user.uid}/database.json`);
  await child.put(blob, metadata);

  console.log("Synced!");
}

function initSync(database, firebase) {
  if (!timer) {
    timer = setInterval(() => sync(database, firebase), ONE_MIN);
  }
}

export default initSync;
