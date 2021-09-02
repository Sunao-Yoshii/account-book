import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';
import { api } from 'lwc';

export default class Detail extends CssCommonElement {
  @api brand;
  isView = true;
  errorMessage = null;

  get hasError() {
    return this.errorMessage;
  }

  handleModeChange(event) {
    const element = event.path[0];
    const value = element.getAttribute('data-view-mode');
    this.isView = value === 'true';
  }

  handleSave() {
    const nameInput = this.template.querySelector('input[name="brand_name"]');
    const descriptionInput = this.template.querySelector('textarea[name="description"]');

    this.brand = {
      id: this.brand.id,
      name: nameInput.value,
      description: descriptionInput.value
    };

    Ajax.post(
      Endpoints.UPDATE_SINGLE_BRAND + this.brand.id,
      { name: this.brand.name, description: this.brand.description }
    ).then(success => {
      this.isView = true;
      this.dispatchEvent(new CustomEvent('refresh', { bubbles: true, composed : false }));
    }, rejectReason => {
      this.errorMessage = JSON.stringify(rejectReason);
    });
  }

  handleDelete() {
    let res = window.confirm('本当に削除しますか？（取り消せません）');
    if (res) {
      this.dispatchEvent(new CustomEvent('remove'));
    }
  }
}
