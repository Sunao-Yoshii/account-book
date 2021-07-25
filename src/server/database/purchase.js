const common = require("./DBCommon")
const TABLE_NAME = 'purchase';

const DBCommon = common.DBCommon;

function currentDate() {
  let date = Date.now();
  return date;
}

class defaults {
  id = null;
  brandId = null;
  buyAmount = 0;
  currentValuation = 0;
  isClosed = null;
  createdAt = currentDate();
  updatedAt = currentDate();
}

class Purchase {
  constructor(option) {
    const defs = new defaults();
    this.id = option.id || defs.id;
    this.brandId = option.brandId || defs.brandId;
    this.buyAmount = option.buyAmount || defs.buyAmount;
    this.currentValuation = option.currentValuation || option.buyAmount || defs.currentValuation;
    this.isClosed = option.isClosed || defs.isClosed;
    this.createdAt = option.createdAt || defs.createdAt;
    this.updatedAt = option.updatedAt || defs.updatedAt;
  }
}

class PurchaseTable {
  static async createTable() {
    const db = DBCommon.get();
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists ${TABLE_NAME} (
            id integer primary key AUTOINCREMENT,
            brand_id integer not null,
            buy_amount integer not null,
            current_valuation integer not null,
            is_closed integer default null,
            created_at timestamp not null,
            updated_at timestamp not null,
            foreign key (brand_id) references brand(id)
          )`)
        });
        return resolve()
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * @param {Purchase} purchase 
   */
  static async insert(purchase) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        db.run(
          `insert into ${TABLE_NAME} (brand_id, buy_amount, current_valuation, created_at, updated_at) 
           values ($brandId, $buyAmount, $currentValuation, $createdAt, $updatedAt)`,
          purchase.brandId, purchase.buyAmount, purchase.currentValuation, purchase.createdAt, purchase.updatedAt
        )
        return resolve()
      } catch (error) {
        return reject(error)
      }
    });
  }

  /**
   * @param {Purchase} purchase 
   */
  static async update(purchase) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        db.run(
          `update ${TABLE_NAME} set current_valuation = $currentValuation,  is_closed = $isClosed, updated_at = $updatedAt where id = $id`,
          purchase.currentValuation, purchase.isClosed, purchase.updatedAt, purchase.id
        )
        return resolve()
      } catch (error) {
        return reject(error)
      }
    });
  }

  /**
   * @param {Array} purchases 
   */
  static async updates(purchases) {
    purchases.forEach(async v => {
      await PurchaseTable.update(v);
    });
  }

  /**
   * @param {number} brandId
   */
  static async deleteByBrand(brandId) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        db.run(`delete from ${TABLE_NAME} where brand_id = $brandId`, brandId);
        return resolve();
      } catch (error) {
        db.exec('rollback');
        return reject(error);
      }
    });
  }

  /**
   * @param {integer} brandId 
   * @returns {Array}
   */
  static async selectByBrand(brandId) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        const result = [];
        db.serialize(() => {
          db.all(
            `select * from ${TABLE_NAME} where brand_id = $brandId order by id desc`,
            brandId,
            (err, res) => {
              if (err) return reject(err);
              if (!res) return resolve([]);
              res.forEach(row => {
                result.push(new Purchase({
                  id: row['id'],
                  brandId: row['brand_id'],
                  buyAmount: row['buy_amount'],
                  currentValuation: row['current_valuation'],
                  isClosed: row['is_closed'],
                  createdAt: row['created_at'],
                  updatedAt: row['updated_at']
                }))
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

  /**
   * @param {integer} brandId 
   * @returns {Array}
   */
  static async selectNotClosed(brandId) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        const result = [];
        db.serialize(() => {
          db.all(
            `select * from ${TABLE_NAME} where brand_id = $brandId and is_closed is null order by id desc`,
            brandId,
            (err, res) => {
              if (err) return reject(err);
              if (!res) return resolve([]);
              res.forEach(row => {
                result.push(new Purchase({
                  id: row['id'],
                  brandId: row['brand_id'],
                  buyAmount: row['buy_amount'],
                  currentValuation: row['current_valuation'],
                  isClosed: row['is_closed'],
                  createdAt: row['created_at'],
                  updatedAt: row['updated_at']
                }))
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

exports.defaults = defaults;
exports.Purchase = Purchase;
exports.PurchaseTable = PurchaseTable;
