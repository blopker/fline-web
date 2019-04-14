import Dexie from "dexie";
import devData from "./devData";

const date = new Date();
const sdate = date.toLocaleDateString();

class KeyValue {
  constructor(db) {
    this.db = db;
  }
  async getAll() {
    let arr = await this.db.table(this.tableName).toArray();
    return arr.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
  }
  async get(key) {
    let entry = await this.db
      .table(this.tableName)
      .where({ key })
      .first();
    if (entry === undefined) {
      return entry;
    }
    return entry.value;
  }
  async set(key, value) {
    this.db.table(this.tableName).put({ key, value });
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
    this.tableName = "settings";
  }
  async get(key) {
    // if (key === sdate) {
    //   return devData.test;
    // }
    let day = await super.get(key);
    if (!day) {
      return { graph: [], events: [] };
    } else {
      return day;
    }
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
