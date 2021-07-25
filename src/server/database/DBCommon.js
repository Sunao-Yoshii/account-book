const sqlite3 = require("sqlite3")

// ファイルに対応した、ただ１つのインスタンス
let database

class DBCommon {
  static init() {
    database = new sqlite3.Database("data.sqlite3")
  }

  /**
   * @returns {sqlite3.Database}
   */
  static get() {
    return database
  }
}

DBCommon.init();

exports.DBCommon = DBCommon;
