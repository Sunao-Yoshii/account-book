import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';

export default class Form extends CssCommonElement {
  name;
  description;
  errorMessage;

  get hasError() {
    return this.errorMessage;
  }

  constructor() {
    super();
    this.init();
  }

  init() {
    this.name = '';
    this.description = '';
    this.errorMessage = null;
  }

  onSubmit() {
    const nameInput = this.template.querySelector('input[name="name"]');
    const descriptionText = this.template.querySelector('textarea[name="description"]');
    Ajax.post(Endpoints.POST_CREATE_BRAND, { name: nameInput.value, description: descriptionText.value })
      .then(success => {
        this.dispatchEvent(new CustomEvent('brandclose'));
      }, rejectReason => {
        this.errorMessage = JSON.stringify(rejectReason);
      });
  }

  dispatchClose(event) {
    this.dispatchEvent(new CustomEvent('brandclose'));
    this.init();
  }
}
