import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';
import { api, track } from 'lwc';

export default class UpdateForm extends CssCommonElement {
  errorMessage;
  name;
  @api editTarget;

  connectedCallback() {
    super.connectedCallback();
    this.errorMessage = null;
  }

  dispatchClose(event) {
    this.dispatchEvent(new CustomEvent('close'));
  }

  async onSubmit(event) {
    let idVal = this.editTarget.id;
    let currentVal = this.template.querySelector('input[name="amount"]').value;
    let unitVal = this.template.querySelector('input[name="unit"]').value;
    let url = Endpoints.UPDATE_PURCHASES + idVal;

    try {
      await Ajax.post(url, { isClosed: null, currentValuation: currentVal, unit: unitVal, id: idVal });
      this.dispatchEvent(new CustomEvent('update'));
    } catch (error) {
      console.log(error);
      this.errorMessage = JSON.stringify(error);
    }
  }
}
