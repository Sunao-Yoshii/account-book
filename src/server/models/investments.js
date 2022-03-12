const common = require("./DBCommon");
const sqlite3 = require("sqlite3")

function createTable() {
  const db = common.DBCommon.get();
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        db.run(
          `create table if not exists Investment (
            id integer primary key AUTOINCREMENT,
            brand_id integer not null,
            purchase_date date not null,
            amount integer not null,
            stocks integer default null,
            is_sold boolean default false,
            foreign key (brand_id) references Brand(id)
          )`
        );
        db.run(
          `create table if not exists AmountHistory (
            id integer primary key AUTOINCREMENT,
            investment_id integer not null,
            check_at date not null,
            amount integer not null,
            stocks integer default null,
            foreign key (investment_id) references Investment(id)
          )`
        );
      });
      return resolve();
    } catch (error) {
      console.log('Schema creation error!');
      console.log(error);
      return reject(error);
    }
  });
}
createTable();

class Investment {  // js に型はいう程意味ないけど、気分かな
  constructor(id, brandId, purchaseDate, amount, stocks, isSold) {
    this.id = id;
    this.brandId = brandId;
    this.purchaseDate = purchaseDate;
    this.amount = amount;
    this.stocks = stocks;
    this.isSold = isSold;
  }
}

class AmountHistory {
  constructor(id, investmentId, checkAt, amount, stocks) {
    this.id = id;
    this.investment = investmentId;
    this.checkAt = checkAt;
    this.amount = amount;
    this.stocks = stocks
  }
}

class InvestmentTable {

  /**
   * 銘柄指定で、非売却済みの購入履歴を取得します。
   * @param {string} brandId 
   * @param {sqlite3.Database} db 
   */
  static async selectByBrand(brandId, db = common.DBCommon.get()) {
    try {
      return new Promise((resolve, reject) => {
        db.all(
          `select id, brand_id, purchase_date, amount, stocks, is_sold from Investment 
           where brand_id = $brandId and is_sold = false order by purchase_date desc`,
          { $brandId: brandId },
          (err, rows) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(rows.map(v => {
                return {
                  id: v.id,
                  brandId: v.brand_id,
                  purchaseDate: v.purchase_date,
                  amount: v.amount,
                  stocks: v.stocks,
                  isSold: v.is_sold
                };
              }));
            }
          }
        )
      });
    } catch (error) {
      console.log(error);
      throw new Error('銘柄の検索取得に失敗しました。')
    }
  }

  static async selectHistories(id, db = common.DBCommon.get()) {
    try {
      return new Promise((resolve, reject) => {
        db.all(
          `select id, investment_id, check_at, amount, stocks from AmountHistory as hist1 
           where investment_id = $id order by check_at desc`,
          { $investment_id: id },
          (err, row) => {
            if (row) {
              resolve(new AmountHistory(
                row.id, row.investment_id, row.check_at,
                row.amount, row.stocks
              ))
            } else {
              console.log(err);
              reject(err);
            }
          }
        )
      });
    } catch (error) {
      console.log(error);
      throw new Error('履歴の検索取得に失敗しました。')
    }
  }

  static async selectHistory(id, db = common.DBCommon.get()) {
    try {
      return new Promise((resolve, reject) => {
        db.get(
          `select id, investment_id, check_at, amount, stocks from AmountHistory as hist1 
           where investment_id = $investment_id and check_at = (select max(hist2.check_at) from AmountHistory hist2 where hist2.investment_id = $investment_id)`,
          { $investment_id: id },
          (err, row) => {
            console.log('selectHistory=====');
            console.log(id);
            console.log(row);
            if (row) {
              resolve(new AmountHistory(
                row.id, row.investment_id, row.check_at,
                row.amount, row.stocks
              ))
            } else {
              console.log('errors!');
              console.log(err);
              reject(err);
            }
          }
        )
      });
    } catch (error) {
      console.log(error);
      throw new Error('履歴の検索取得に失敗しました。')
    }
  }

  /**
   * 購入履歴を更新します
   * @param {Investment} investment 
   * @param {sqlite3.Database} db 
   */
  static async update(investment, db = common.DBCommon.get()) {
    db.run(
      `update Investment values purchase_date=$purchaseDate, amount=$amount, stocks=$stocks, is_sold=$isSold where id=$id`,
      { $purchaseDate: investment.purchaseDate, $amount: investment.amount, $stocks: investment.stocks, $isSold: investment.isSold, $id: investment.id }
    )
  }

  /**
   * 
   * @param {string} id 
   * @param {sqlite3.Database} db 
   */
  static async updateAsSold(id, db = common.DBCommon.get()) {
    db.run(
      `update Investment values is_sold=true where id = ?`,
      id
    )
  }

  /**
   * 購入履歴を改めて作成する
   * @param {Investment} investment 
   * @param {sqlite3.Database} db 
   */
  static async createInvest(investment, db = common.DBCommon.get()) {
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          let tempDb = db.exec(`BEGIN TRANSACTION tran1`);
          try {
            tempDb.run(
              `insert into Investment (brand_id, purchase_date, amount, stocks, is_sold) values ($brandId, $purchaseDate, $amount, $stocks, false)`,
              { $brandId: investment.brandId, $purchaseDate: investment.purchaseDate, $amount: investment.amount, $stocks: investment.stocks },
              (err) => {
                if (err) {
                  reject(new Error('資産購入の作成に失敗しました。'))
                  return;
                }
                console.log('step1');
                tempDb.get(
                  `select id from Investment order by id desc limit 1`,
                  (err, row) => {
                    if (row) {
                      console.log('step2');
                      console.log(row);
                      let tempId = row.id;
                      tempDb.run(
                        `insert into AmountHistory (investment_id, check_at, amount, stocks) values ($invId, $checkAt, $amount, $stock)`,
                        {
                          $invId: tempId,
                          $checkAt: investment.purchaseDate,
                          $amount: investment.amount,
                          $stock: investment.stocks
                        },
                        (err) => {
                          if (err) {
                            tempDb.exec(`ROLLBACK TRANSACTION tran1`);
                            console.log(err);
                            reject(new Error('投資履歴が作成できませんでした。'));
                            return;
                          }
                          
                          console.log('step3 ');
                          tempDb.exec(`COMMIT TRANSACTION tran1`);
                          resolve();
                        }
                      )
                    } else {
                      console.log(err);
                      tempDb.exec(`ROLLBACK TRANSACTION tran1`);
                      reject(new Error('投資履歴が作成できませんでした。'));
                    }
                  }
                );
              }
            );
            
          } catch (error) {
            tempDb.exec(`ROLLBACK TRANSACTION tran1`);
            reject(error)
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

exports.Investment = Investment;
exports.InvestmentTable = InvestmentTable;
