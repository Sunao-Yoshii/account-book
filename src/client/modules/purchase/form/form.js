import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';
import { api } from 'lwc';

function twoDigit(value) {
  if (value < 10) {
    return '0' + value;
  }
  return value.toString()
}

export default class Lists extends CssCommonElement {
  errorMessage = null;
  amount;
  selectedDate;
  @api brandId;

  constructor() {
    super();
    this.resetValue();
  }

  resetValue() {
    const today = new Date(Date.now());
    const month = twoDigit(today.getMonth() + 1);
    const day = twoDigit(today.getDate());
    this.amount = 0;
    this.selectedDate = `${today.getFullYear()}-${month}-${day}`;
  }

  isValid(data) {
    let error = '';
    if (!data.amount) {
      error += '購入金額は必須です。';
    }
    if (!data.dateValue) {
      error += '購入日は必須です。';
    }
    if (error !== '') {
      this.errorMessage = error;
      return false;
    }
    return true;
  }

  async handleSave() {
    const amountInput = this.template.querySelector('input[name="buyAmount"]');
    const dateInput = this.template.querySelector('input[name="buyDate"]');
    const data = {
      amount: amountInput.value,
      dateValue: dateInput.value
    };
    if (!this.isValid(data)) {
      return;
    }

    let dateVal = new Date(data.dateValue);
    let save = {
      brandId: this.brandId,
      buyAmount: data.amount,
      currentValuation: data.amount,
      createdAt: dateVal.getTime(),
      updatedAt: dateVal.getTime()
    };
    
    try {
      await Ajax.post(Endpoints.POST_PURCHASES, save);
      this.resetValue();
      this.dispatchEvent(new CustomEvent('create'));
    } catch (error) {
      this.errorMessage = JSON.stringify(error);
    }
  }
}
