import { CssCommonElement } from 'bootstrap/base';
import { api } from 'lwc';

export default class TextArea extends CssCommonElement {
  @api value = null;
  @api label = null;
  @api row = 3;

  onChange(event) {
    const value = event.path[0].value;
    this.dispatchEvent(new CustomEvent('change', { detail: value }));
  }
}
