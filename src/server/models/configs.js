const common = require("./DBCommon")
const TABLE_NAME = 'config';

const DBCommon = common.DBCommon;

function createTable() {  // テーブルが無ければ作る処理
  const db = DBCommon.get();
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        db.run(`create table if not exists ${TABLE_NAME} (
          id integer primary key AUTOINCREMENT,
          reserve_amount integer not null default 0,
          tax_rate real not null default 20,
          gain_rate real not null default 20,
          split_invest_months integer default 120
        )`)
      });
      return resolve()
    } catch (error) {
      return reject(error);
    }
  });
}
createTable();

class AppConfig {  // js に型はいう程意味ないけど、気分かな
  constructor(id, reserveAmount, taxRate, gainRate, splitInvestMonths) {
    this.id = id;
    this.reserveAmount = reserveAmount;
    this.taxRate = taxRate;
    this.gainRate = gainRate;
    this.splitInvestMonths = splitInvestMonths;
  }
}

class AppConfigTable {

  /**
   * @param {AppConfig} brand 
   */
  static async upsert(config, db = DBCommon.get()) {
    try {
      const current = await AppConfigTable.select();
      console.log('upsert====');
      console.log(config);
      console.log(current);
      if (!current) {
        db.run(
          `insert into ${TABLE_NAME} (reserve_amount, tax_rate, gain_rate, split_invest_months) values ($reserve_amount, $tax_rate, $gain_rate, $split_invest_months)`,
          config.reserveAmount, config.taxRate, config.gainRate, config.splitInvestMonths
        )
      } else {
        db.run(
          `update ${TABLE_NAME} SET reserve_amount=$reserve_amount, tax_rate=$tax_rate, gain_rate=$gain_rate, split_invest_months=$split_invest_months WHERE id = $id`,
          config.reserveAmount, config.taxRate, config.gainRate, config.splitInvestMonths, current.id
        )
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 既存の設定を検索する
   * @param {DBCommon} db 
   * @returns 
   */
  static async select(db = DBCommon.get()) {
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.all(
            `select id, reserve_amount, tax_rate, gain_rate, split_invest_months from ${TABLE_NAME} limit 1`,
            (err, res) => {
              if (err) return reject(err);
              if (!res || res.length === 0) return resolve(null);
              console.log(res);
              const respond = res[0];
              console.log(respond);
              const result = new AppConfig(
                respond['id'],
                respond['reserve_amount'],
                respond['tax_rate'],
                respond['gain_rate'],
                respond['split_invest_months']
              );
              console.log(result);
              return resolve(result);
            }
          )
        })
      } catch (error) {
        return reject(error);
      }
    });
  }
}

exports.AppConfig = AppConfig;
exports.AppConfigTable = AppConfigTable;