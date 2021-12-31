import CssCommonElement from 'bootstrap/cssCommonElement';
import { api } from 'lwc';

export default class InputText extends CssCommonElement {
  @api cssStyle = '';
  @api label = null;
  @api disabled = false;
  @api value = '';
  @api placeholder = null;
  @api maxLength = 255;
  @api minLength = 0;
  @api pattern = null;

  onChange(event) {
    this.dispatchEvent(new CustomEvent('change', { detail: event.target.value }));
  }
}
