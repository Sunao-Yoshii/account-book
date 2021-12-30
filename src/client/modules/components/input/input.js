import CssCommonElement from 'bootstrap/cssCommonElement';
import { api } from 'lwc';

export default class Input extends CssCommonElement {
  @api cssStyle = '';
  @api label = null;
  @api type = 'text';
  @api disabled = false;
  @api value = '';
  @api placeholder = null;

  onChange(event) {
    this.dispatchEvent(new CustomEvent('change', { detail: event.target.value }));
  }
}
