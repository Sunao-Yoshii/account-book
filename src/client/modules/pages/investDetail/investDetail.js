import { CssCommonElement } from 'bootstrap/base';
import Investment from 'common/investment';
import { api } from 'lwc';

export default class InvestDetail extends CssCommonElement {
  _investment = {};
  @api set investment(v) {
    if (v) {
      this._investment = v;
      this.loadLatestHistory(v.id);
    }
  }
  get investment() {
    return this._investment;
  }

  _state = 'read';
  @api set mode(v) {
    this._state = v;
  }
  get mode() {
    return this._state;
  }

  @api config = {};

  errorMessage = null;
  latestDetail = {};
  rowInfo = {};

  async loadLatestHistory(investId) {
    try {
      this.latestDetail = await Investment.getDetail(investId);
      this.updateRowInfo();
    } catch (error) {
      window.console.log(error);
      this.errorMessage = '読み込みに失敗しました。';
    }
  }

  updateRowInfo() {
    window.console.log('updateRowInfo--------');
    if (!this.config.gainRate) {
      window.console.log('Error!');
      window.console.log(Object.assign({}, this.config));
      return;
    }
    window.console.log('Success');
    let temp = Object.assign({}, this._investment);
    temp.stocks = this.latestDetail.stocks;
    temp.diff = this.latestDetail.amount - temp.amount;
    temp.currentAccount = this.latestDetail.amount;
    temp.currentAccountRate = this.latestDetail.amount / temp.amount;
    temp.currentState = this.latestDetail.amount > temp.amount ? 'green' : 'red';
    temp.lastUpdateAt = this.latestDetail.checkAt;
    window.console.log(Object.assign({}, temp));
    this.rowInfo = temp;
  }
}
