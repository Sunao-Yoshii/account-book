import Ajax from 'common/ajax';

const HTTP_ENDPOINT = 'http://localhost:3002/api/v1/config';

export default class AppConfig {
  static async getConfig() {
    let response = await Ajax.get(HTTP_ENDPOINT);
    return response?.taxRate ? response : null;
  }

  static async saveConfig(reserveAmount, taxRate, sellRate, investMonths) {
    return Ajax.post(HTTP_ENDPOINT, {
      reserveAmount: reserveAmount,
      taxRate: taxRate,
      gainRate: sellRate,
      splitInvestMonths: investMonths
    });
  }
}
