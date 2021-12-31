import { CssCommonElement } from 'bootstrap/base';
import AppConfig from 'common/AppConfig';

export default class Config extends CssCommonElement {
  reserveAmount = 100000;
  taxRate = 20;
  sellRate = 20;
  splitInvestMonths = 120;
  errorMessage = null;
  successMessage = null;

  connectedCallback() {
    super.connectedCallback();
    this.loadSetting();
  }

  onChange(event) {
    const intFields = ['reserveAmount', 'splitInvestMonths'];
    const fieldValue = event.path[0].getAttribute('data-role');
    this[fieldValue] = intFields.indexOf(fieldValue) < 0 ? parseFloat(event.detail) : parseInt(event.detail);
  }

  async loadSetting() {
    const result = await AppConfig.getConfig();
    if (!result) return;
    this.reserveAmount = result.reserveAmount;
    this.taxRate = result.taxRate;
    this.sellRate = result.gainRate;
    this.splitInvestMonths = result.splitInvestMonths;
  }

  async saveAction() {
    this.errorMessage = null;
    this.successMessage = null;
    try {
      await AppConfig.saveConfig(this.reserveAmount, this.taxRate, this.sellRate, this.splitInvestMonths);
      this.successMessage = '更新が完了しました！';
    } catch (error) {
      window.console.log(error);
      this.errorMessage = '保存時エラーが発生しました。ログを確認してください。';
    }
  }
}
