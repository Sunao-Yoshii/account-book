import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';
import { api } from 'lwc';

export default class Form extends CssCommonElement {
  @api brandId;
  currentAmount = 0;
  errorMessage = null;

  async handleSubmit() {
    const amountInput = this.template.querySelector('input[name="currentAmount"]');
    this.currentAmount = 0;
    const date = Date.now();

    const requestBody = {
      brandId: this.brandId,
      amount: amountInput.value,
      createdAt: date
    };

    try {
      await Ajax.post(Endpoints.POST_CURRENT_AMOUNT, requestBody);
      this.currentAmount = 0;
      this.dispatchEvent(new CustomEvent('saved'));
    } catch (error) {
      this.errorMessage = JSON.stringify(error);
    }
  }
}
