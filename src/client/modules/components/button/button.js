import CssCommonElement from 'bootstrap/cssCommonElement';
import { api } from 'lwc';

const VARIANT_PRIMARY = 'primary';
// const VARIANT_SECONDARY = 'secondary';
// const VARIANT_SUCCESS = 'success';
// const VARIANT_DANGER = 'danger';
// const VARIANT_WARNING = 'warning';
// const VARIANT_INFO = 'info';
// const VARIANT_LIGHT = 'light';
// const VARIANT_DARK = 'dark';

export default class Button extends CssCommonElement {
  @api label='';
  @api variant = VARIANT_PRIMARY;
  @api isOutline = false;

  get cssClass() {
    const btnStyle = 'btn-' + (this.isOutline == true ? 'outline-' : '') + this.variant;
    return 'btn ' + btnStyle;
  }

  onClick(e) {
    this.dispatchEvent(e);
  }
}
