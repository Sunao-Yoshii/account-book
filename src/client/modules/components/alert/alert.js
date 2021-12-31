import { CssCommonElement, Constants } from 'bootstrap/base';
import { api } from 'lwc';

export default class Alert extends CssCommonElement {
  @api variant = Constants.VARIANTS.primary;
  @api hideDismiss = false;

  display = true;

  get cssClass() {
    return 'alert alert-' + this.variant + ' clearfix';
  }

  @api show() {
    this.display = true;
  }

  onClickHide() {
    this.display = false;
    this.dispatchEvent(new CustomEvent('hide'));
  }
}
