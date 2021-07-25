const common = require("./DBCommon")
const TABLE_NAME = 'amount_log';

const DBCommon = common.DBCommon;

function currentDate() {
  let date = Date.now();
  return date;
}

class defaults {
  id = null;
  purchaseId = null;
  currentAmount = 0;
  createdAt = currentDate();
}

class AmountLog {
  constructor(option) {
    const defs = new defaults();
    this.id = option.id || defs.id;
    this.purchaseId = option.purchaseId || defs.purchaseId;
    this.currentAmount = option.currentAmount || defs.currentAmount;
    this.createdAt = option.createdAt || defs.createdAt;
  }
}

class AmountLogTable {
  static async createTable() {
    const db = DBCommon.get();
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists ${TABLE_NAME} (
            id integer primary key AUTOINCREMENT,
            purchase_id integer not null,
            current_amount integer not null,
            created_at timestamp not null,
            foreign key (purchase_id) references purchase(id)
          )`)
        });
        return resolve()
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * @param {AmountLog} amountLog 
   */
  static async insert(amountLog) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        db.run(
          `insert into ${TABLE_NAME} (purchase_id, current_amount, created_at) 
           values ($purchaseId, $currentAmount, $createdAt)`,
           amountLog.purchaseId, amountLog.currentAmount, amountLog.createdAt
        )
        return resolve()
      } catch (error) {
        return reject(error)
      }
    });
  }

  /**
   * @param {Array} amountLogs 
   */
  static async inserts(amountLogs) {
    amountLogs.forEach(async v => {
      await AmountLogTable.insert(v);
    })
  }

  /**
   * @param {integer} brandId
   */
  static async deleteByBrand(brandId) {
    return new Promise((resolve, reject) => {
      const db = DBCommon.get();
      try {
        db.run(
          `delete from ${TABLE_NAME} where purchase_id IN (SELECT id FROM purchase WHERE brand_id = $brandId)`,
          brandId
        );
        return resolve();
      } catch (error) {
        db.exec('rollback');
        return reject(error);
      }
    });
  }
}

exports.defaults = defaults;
exports.AmountLog = AmountLog;
exports.AmountLogTable = AmountLogTable;

