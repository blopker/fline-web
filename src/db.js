import Dexie from "dexie";
import Immutable from "immutable";

class KeyValue {
  constructor(db) {
    this.db = db;
  }
  async getAll() {
    let arr = await this.db.table(this.tableName).toArray();
    return arr.reduce((obj, item) => {
      obj[item.key] = Immutable.fromJS(item.value);
      return obj;
    }, {});
  }
  async get(key) {
    let entry = await this.db
      .table(this.tableName)
      .where({ key })
      .first()
      .catch(() => {});

    if (entry === undefined) {
      return entry;
    }
    return Immutable.fromJS(entry.value);
  }
  async set(key, value) {
    value = value.toJS();
    await this.db.table(this.tableName).put({ key, value });
  }
}

class Settings extends KeyValue {
  constructor(db) {
    super(db);
    this.tableName = "settings";
  }
}

class Days extends KeyValue {
  constructor(db) {
    super(db);
    this.tableName = "days";
  }
  async get(key) {
    let day = await super.get(key);
    if (!day) {
      return Immutable.fromJS({ graph: [], events: [] });
    }
    day = day.set(
      "events",
      day.get("events").map(e => {
        return Immutable.fromJS({
          event: e.get("event"),
          time: new Date(e.get("time"))
        });
      })
    );
    return day;
  }
}

function init() {
  const _db = new Dexie("Fline");
  _db.version(1).stores({
    days: "&key",
    settings: "&key"
  });
  return {
    settings: new Settings(_db),
    days: new Days(_db)
  };
}

export default init;
