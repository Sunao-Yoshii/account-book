const sqlite3 = require("sqlite3")

let database

class DBCommon {
  static init() {
    database = new sqlite3.Database("data.sqlite3")
  }
  static get() {
    return database
  }
}

DBCommon.init();
exports.DBCommon = DBCommon;
