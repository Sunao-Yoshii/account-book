const common = require("./DBCommon")
const purchases = require('./purchase');
const TABLE_NAME = 'brand';

const DBCommon = common.DBCommon;

class Brand {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

class BrandTable {
  static async createTable() {
    const db = DBCommon.get();
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists ${TABLE_NAME} (
            id integer primary key AUTOINCREMENT,
            name text not null unique,
            description text default null
          )`)
        });
        return resolve()
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * @param {Brand} brand 
   */
  static async insert(brand) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        db.run(
          `insert into ${TABLE_NAME} (name, description) values ($name, $description)`,
          brand.name, brand.description
        )
        return resolve()
      } catch (error) {
        return reject(error)
      }
    });
  }

  /**
   * @param {Brand} brand 
   */
  static async update(brand) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        db.run(
          `update ${TABLE_NAME} set name = $name,  description = $description where id = $id`,
          brand.name, brand.description, brand.id
        )
        return resolve()
      } catch (error) {
        return reject(error)
      }
    });
  }

  /**
   * @param {number} id
   */
  static async delete(id) {
    const db = DBCommon.get();
    return new Promise(async (resolve, reject) => {
      try {
        db.run(`delete from ${TABLE_NAME} where id = $id`, id);
        return resolve();
      } catch (error) {
        db.exec('rollback');
        return reject(error);
      }
    });
  }

  static async count() {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        db.get(
          `select count(*) as cnt from ${TABLE_NAME}`,
          (err, row) => {
            if (err) return reject(err);
            return resolve(row["cnt"])
          }
        )
      } catch (error) {
        reject(error);
      }
    })
  }

  static async selectAll() {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        const result = [];
        db.serialize(() => {
          db.all(
            `select id, name, description from ${TABLE_NAME} order by id`,
            (err, res) => {
              if (err) return reject(err);
              if (!res) return resolve([]);
              res.forEach(row => {
                result.push(new Brand(row['id'], row['name'], row['description']))
              });
              return resolve(result);
            }
          )
        })
      } catch (error) {
        reject(error);
      }
    })
  }

  static async select(id) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        const result = [];
        db.serialize(() => {
          db.all(
            `select * from ${TABLE_NAME} where id = $id`,
            id,
            (err, res) => {
              if (err) return reject(err);
              if (!res) return resolve([]);
              res.forEach(row => {
                result.push(new Brand(row['id'], row['name'], row['description']))
              });
              return resolve(result);
            }
          )
        })
      } catch (error) {
        reject(error);
      }
    })
  }
}

exports.Brand = Brand;
exports.BrandTable = BrandTable;
