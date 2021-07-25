import CssCommonElement from '../../lib/common/common';
import { api } from 'lwc';

export default class Dialog extends CssCommonElement {

  @api submitName;
  @api cancelName;
  @api title;
  @api isLarge;

  get addCss() {
    return this.isLarge ? 'modal-dialog modal-lg' : 'modal-dialog';
  }

  constructor() {
    super();
  }

  onClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  onSubmit() {
    this.dispatchEvent(new CustomEvent('submit'));
  }
}
