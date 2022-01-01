import { CssCommonElement } from 'bootstrap/base';
import { api } from 'lwc';
import Investment from 'common/investment';

const MODE_BUTTON = 0;
const MODE_EDIT = 1;

function todayStr() {
  const today = new Date(Date.now());
  return today.getFullYear()
    + '-' + (today.getMonth() + 1)
    + '-' + today.getDate();
}

export default class InvestmentForm extends CssCommonElement {
  errorMessage = null;
  mode = MODE_BUTTON;
  @api brandId = null;

  purchaseDate = todayStr();
  amount = 0;
  stocks = 0;
  isSold = false;

  get isShow() {
    return this.mode === MODE_BUTTON;
  }

  reset() {
    this.purchaseDate = todayStr();
    this.amount = 0;
    this.stocks = 0;
  }

  handleEdit() {
    this.mode = MODE_EDIT;
  }

  handleCancel() {
    this.reset();
    this.mode = MODE_BUTTON;
  }

  handleChange(e) {
    const fieldName = e.path[0].getAttribute('data-role');
    this[fieldName] = e.detail;
  }

  async handleSave(e) {
    this.errorMessage = null;
    try {
      await Investment.insert(this.brandId, this.purchaseDate, this.amount, this.stocks);
      this.reset();
      this.dispatchEvent(new CustomEvent('created'));
      this.mode = MODE_BUTTON;
    } catch (error) {
      this.errorMessage = '購入履歴の追加に失敗しました。お手数ですがログを確認してください。';

    }
  }
}
