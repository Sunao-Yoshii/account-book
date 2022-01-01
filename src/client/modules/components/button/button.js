import { CssCommonElement, Constants } from 'bootstrap/base';
import { api } from 'lwc';

export default class Button extends CssCommonElement {
  @api label = '';
  @api variant = Constants.VARIANTS.primary;
  @api isOutline = false;

  get cssClass() {
    const btnStyle =
      'btn-' + (this.isOutline ? 'outline-' : '') + this.variant;
    return 'btn ' + btnStyle;
  }
}
