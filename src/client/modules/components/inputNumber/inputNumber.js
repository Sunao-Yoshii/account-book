import CssCommonElement from 'bootstrap/cssCommonElement';
import { api } from 'lwc';

export default class InputNumber extends CssCommonElement {
  @api cssStyle = '';
  @api label = null;
  @api disabled = false;
  @api value = 0;
  @api placeholder = null;
  @api max=2147483647;
  @api min=-2147483648;
  @api step=1;
  @api readOnly = false;

  onChange(event) {
    this.dispatchEvent(new CustomEvent('change', { detail: event.target.value }));
  }
}
