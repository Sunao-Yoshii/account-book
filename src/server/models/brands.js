const common = require("./DBCommon");
const sqlite3 = require("sqlite3")

function createTable() {
  const db = common.DBCommon.get();
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        db.run(
          `create table if not exists Brand (
            id integer primary key AUTOINCREMENT,
            name varchar(512) not null,
            account varchar(32) not null,
            description text default null
          )`
        )
      });
      return resolve();
    } catch (error) {
      return reject(error);
    }
  });
}
createTable();

class Brand {  // js に型はいう程意味ないけど、気分かな
  constructor(id, name, account, description) {
    this.id = id;
    this.name = name;
    this.account = account;
    this.description = description;
  }
}

class BrandTable {

  /**
   * 指定の銘柄を１件取得する
   * @param {String} id 
   * @param {sqlite3.Database} db 
   * @returns 
   */
  static async select(id, db = common.DBCommon.get()) {
    return new Promise((resolve, reject) => {
      db.get(`select id, name, account, description from Brand where id = ?`, id, (err, row) => {
        if (row) {
          resolve(row);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * 有効な全行を名称順で取得します
   * @param {sqlite3.Database} db 
   */
  static async selectAll(db = common.DBCommon.get()) {
    return new Promise((resolve, reject) => {
      db.all('select id, name, account, description from Brand order by name', (err, rows) => {
        if (rows) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * 最新の1件を取得します
   * @param {sqlite3.Database} db 
   */
  static async selectLatest(db = common.DBCommon.get()) {
    return new Promise((resolve, reject) => {
      db.get('select id from Brand order by id desc limit 1', (err, row) => {
        if (row) {
          resolve(row.id);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * 保存
   * @param {Brand} brand 
   * @param {sqlite3.Database} db 
   */
  static async insert(brand, db = common.DBCommon.get()) {
    db.run(
      `insert into Brand (name, account, description) values ($name, $account, $description)`,
      { $name: brand.name, $account: brand.account, $description:brand.description }
    );
  }

  /**
   * 削除
   * @param {String} id 
   * @param {sqlite3.Database} db 
   */
  static async delete(id, db = common.DBCommon.get()) {
    db.run(`delete from Brand where id=?`, id);
  }
}

exports.Brand = Brand;
exports.BrandTable = BrandTable;
