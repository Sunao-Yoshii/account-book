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

class SellRequestDefault {
  purchaseId = null;
  amount = 0;
  sellAt = currentDate();
}

class SellRequest {
  constructor(option) {
    const defaults = new SellRequestDefault();
    this.purchaseId = option.purchaseId || defaults.purchaseId;
    this.amount = option.amount || defaults.amount;
    this.sellAt = option.sellAt || defaults.sellAt;
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
        let idUnits = [];
        let totalUnits = 0;
        allPurchases.forEach(v => {
          if (!v.unit || v.unit <= 0) return;
          idUnits.push({ purchaseId: v.id, lastUnit: v.unit });
          totalUnits += v.unit;
        });

        if (idUnits.length <= 0) return;

        // 口数から、各行の現在資産額を割合計算する
        idUnits.forEach(v => {
          const latestAmount = parseInt((v.lastUnit / totalUnits) * values.amount);
          v.currentAmount = latestAmount;
          v.id = v.purchaseId;
          v.currentValuation = latestAmount;
          v.unit = v.lastUnit;
          v.isClosed = null;
          v.createdAt = values.createdAt;
          v.updatedAt = values.createdAt;
        });
        
        // トランザクション開始
        await AmountLogTable.inserts(idUnits);  // ログ追加
        await PurchaseTable.updates(idUnits);  // 各購入行の資産価値更新
        db.exec('commit');
        return resolve();
      } catch (error) {
        console.log(error);
        db.exec('rollback');
        return reject(error);
      }
    })
  }

  /**
   * @param {SellRequest} values 
   */
  static async sell(values) {
    return new Promise(async (resolve, reject) => {
      // 売却予定の購入履歴を取得
      let target = await PurchaseTable.selectById(values.purchaseId);
      if (!target || target.length === 0) {
        return reject(new Error('対象の購入履歴が見つかりませんでした'));
      }

      // 端数を適用する購入履歴を取得
      let applyTarget = await PurchaseTable.selectLatestByBrand(target[0].brandId);
      if (!applyTarget || applyTarget.length === 0) {
        return reject(new Error('差額の適用先がありません'));
      }

      // 端数金額を計算
      const diffAmount = target[0].currentValuation - values.amount;
      if (diffAmount < 0) {
        diffAmount = 0;
      }

      const db = DBCommon.get();
      try {
        db.exec('begin');
        // 売却対象履歴の金額を 0 更新して、売却済みフラグを指定する
        let updateValue = target[0];
        updateValue.currentValuation = 0;
        updateValue.isClosed = 1;
        updateValue.updatedAt = values.sellAt;
        await PurchaseTable.update(updateValue);

        // 端数金額を適用先に追加
        if (diffAmount) {
          let applyValue = applyTarget[0];
          applyValue.currentValuation += diffAmount;
          applyValue.updatedAt = values.sellAt;
          await PurchaseTable.update(applyValue);
        }
        db.exec('commit');
        return resolve({ success: true });
      } catch (error) {
        console.log(error);
        db.exec('rollback');
        return reject(error);
      }
    });
  }
}

exports.CurrentAmount = CurrentAmount;
exports.SellRequest = SellRequest;
exports.AssetsLogic = AssetsLogic;
