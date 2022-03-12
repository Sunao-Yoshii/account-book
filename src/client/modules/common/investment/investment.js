import Ajax from 'common/ajax';

const HTTP_ENDPOINT = 'http://localhost:3002/api/v1/brand/';
const getUrl = (brandId) => {
  return HTTP_ENDPOINT + brandId +'/investments'
}
const getSingleUrl = (brandId, investId) => {
  return HTTP_ENDPOINT + brandId +'/investments/' + investId;
};
const getHistoryUrl = (investId) => {
  return 'http://localhost:3002/api/v1/invest/' + investId;
}; 

export default class Investment {

  /**
   * 銘柄IDを指定すると、その銘柄に対応した購入履歴を一括取得します。
   * @param {String} brandId 
   * @returns 
   */
  static async getInvestments(brandId) {
    return Ajax.get(getUrl(brandId));
  }

  /**
   * 資産履歴IDをキーに、直近の資産価値情報を応答する
   * @param {string} investmentId 
   * @returns 
   */
  static async getDetail(investmentId) {
    return Ajax.get(getHistoryUrl(investmentId) + '/latest');
  }

  /**
   * 新規に購入履歴を作成します。
   * @param {integer} brandId 
   * @param {Date} purchaseDate 
   * @param {integer} amount 
   * @param {integer} stock 
   * @returns 
   */
  static async insert(brandId, purchaseDate, amount, stock) {
    return Ajax.put(getUrl(brandId), {
      brandId: brandId,
      purchaseDate: purchaseDate,
      amount: amount,
      stock: stock
    });
  }
}
