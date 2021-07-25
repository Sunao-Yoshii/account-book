const common = require("./database/DBCommon")
const brands = require('./database/brands');
const purchases = require('./database/purchase');
const amountLogs = require('./database/amountLog');

const DBCommon = common.DBCommon;
const BrandTable = brands.BrandTable;
const PurchaseTable = purchases.PurchaseTable;
const AmountLogTable = amountLogs.AmountLogTable;

function currentDate() {
  let date = Date.now();
  return date;
}

class CurrentAmountDefault {
  brandId = 0;
  amount = 0;
  createdAt = currentDate();
}

class CurrentAmount {
  constructor(option) {
    const defaults = new CurrentAmountDefault();
    this.brandId = option.brandId || defaults.brandId;
    this.amount = option.amount || defaults.amount;
    this.createdAt = option.createdAt || defaults.createdAt;
  }
}

class AssetsLogic {
  static async deleteBrand(brandId) {
    const db = DBCommon.get();
    return new Promise(async (resolve, reject) => {
      try {
        db.exec('begin');
        await AmountLogTable.deleteByBrand(brandId);
        await PurchaseTable.deleteByBrand(brandId);
        await BrandTable.delete(brandId);
        db.exec('commit');
        return resolve();
      } catch (error) {
        db.exec('rollback');
        return reject(error);
      }
    })
  }

  /**
   * @param {CurrentAmount} values 
   */
  static async putCurrentAmount(values) {
    const db = DBCommon.get();
    return new Promise(async (resolve, reject) => {
      try {
        db.exec('begin');
        // 関連するブランドの購入記録のうち、売却していない資産をロードする。
        const allPurchases = await PurchaseTable.selectNotClosed(values.brandId);
        // id => 資産価値 のマップ作製
        let idAmount = [];
        let totalAmount = 0;
        allPurchases.forEach(v => {
          const cur = v.currentValuation;
          idAmount.push({ purchaseId: v.id, lastAmount: cur });
          totalAmount += cur;
        });
        // 最新の金額から、各行の現在資産額を割合計算する
        idAmount.forEach(v => {
          const latestAmount = parseInt((v.lastAmount / totalAmount) * values.amount);
          v.currentAmount = latestAmount;
          v.createdAt = values.createdAt;
          v.id = v.purchaseId;
          v.currentValuation = v.currentAmount;
          v.isClosed = null;
          v.updatedAt = values.createdAt;
        });
        
        // トランザクション開始
        await AmountLogTable.inserts(idAmount);  // ログ追加
        await PurchaseTable.updates(idAmount);  // 各購入行の資産価値更新
        db.exec('commit');
        return resolve();
      } catch (error) {
        console.log(error);
        db.exec('rollback');
        return reject(error);
      }
    
    })
  }
}

exports.CurrentAmount = CurrentAmount;
exports.AssetsLogic = AssetsLogic;
