import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';
import { api } from 'lwc';

export default class Form extends CssCommonElement {
  @api brandId;
  @api get defaultAmount() {
    return this._internalAmount;
  }
  set defaultAmount(v) {
    this._internalAmount = v;
    this.currentAmount = v;
  }
  _internalAmount = 0;
  currentAmount = 0;
  errorMessage = null;

  async handleSubmit() {
    const amountInput = this.template.querySelector('input[name="currentAmount"]');
    const date = Date.now();

    const requestBody = {
      brandId: this.brandId,
      amount: amountInput.value,
      createdAt: date
    };

    try {
      await Ajax.post(Endpoints.POST_CURRENT_AMOUNT, requestBody);
      this.dispatchEvent(new CustomEvent('saved'));
    } catch (error) {
      this.errorMessage = JSON.stringify(error);
    }
  }
}
