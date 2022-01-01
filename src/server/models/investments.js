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
        )
      });
      return resolve();
    } catch (error) {
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

class InvestmentTable {

  /**
   * 銘柄指定で、非売却済みの購入履歴を取得します。
   * @param {string} brandId 
   * @param {sqlite3.Database} db 
   */
  static async selectByBrand(brandId, db = common.DBCommon.get()) {
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
   * 購入履歴を新規登録します
   * @param {Investment} investment 
   * @param {sqlite3.Database} db 
   */
  static async insert(investment, db = common.DBCommon.get()) {
    db.run(
      `insert into Investment (brand_id, purchase_date, amount, stocks, is_sold) values ($brandId, $purchaseDate, $amount, $stocks, false)`,
      { $brandId: investment.brandId, $purchaseDate: investment.purchaseDate, $amount: investment.amount, $stocks: investment.stocks }
    )
  }
}

exports.Investment = Investment;
exports.InvestmentTable = InvestmentTable;
