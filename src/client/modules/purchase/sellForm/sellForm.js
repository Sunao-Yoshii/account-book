import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';
import { api } from 'lwc';

export default class SellForm extends CssCommonElement {

  _targetPurchase;
  maxAmount;

  /** @param {object} 購入行 */
  @api get targetPurchase() {
    return _targetPurchase;
  }
  set targetPurchase(value) {
    this._targetPurchase = value;
    this.maxAmount = this._targetPurchase.currentValuation;
  }

  dispatchClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  async onSubmit() {
    const inputForm = this.template.querySelector('input[name="amount"]');
    const sellAmount = parseInt(inputForm.value);
    if (parseInt(inputForm.value) > this.maxAmount) {
      alert('指定できる最大売却額は ' + this.maxAmount + ' 円までです。');
      return;
    }

    // サーバに売却送信
    try {
      const request = {
        purchaseId: this._targetPurchase.id,
        amount: sellAmount
      };
      await Ajax.post(Endpoints.POST_SELL_API, request);
    } catch (error) {
      alert(error);
      console.log(error);
    }

    this.dispatchEvent(new CustomEvent('close'));
  }
}
