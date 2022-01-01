import { CssCommonElement } from 'bootstrap/base';
import { api } from 'lwc';

const toCssClass = (btn) => {
  let variant = btn.variant || 'primary';
  let outline = btn.isOutline ? 'outline-' : '';
  return `btn btn-${outline}${variant}`;
};

export default class Modal extends CssCommonElement {
  @api title = '';
  
  _buttons = [
    { id: 'close', variant: 'secondary', isClose: true, label:'閉じる' }
  ];
  @api set buttons(v) {
    if (v) {
      this._buttons = v;
    }
  }
  get buttons() {
    return this._buttons;
  }

  _show = true;
  @api set show(v) { this._show = v; }
  get show() { return this._show; }

  get cssStyle() {
    return this._show ? 'display:block;background-color: rgba(10,10,10,0.5);' : '';
  }

  get buttonList() {
    let index = 1;
    return this._buttons.map(v => {
      let cpy = Object.assign({}, v);
      cpy.cssClass = toCssClass(cpy);
      cpy.label = cpy.label || 'Button' + index;
      cpy.id = cpy.id || index;
      cpy.isClose = cpy.isClose === undefined ? false : cpy.isClose;
      return cpy;
    });
  }

  handleClickButton(event) {
    let button = event.target;
    const key = button.getAttribute('data-role');
    const match = this.buttonList.find(v => String(v.id) === key);

    this.dispatchEvent(new CustomEvent('select', { detail: key }));
    if (match.isClose) {
      this.handleClose();
    }
  }

  handleClose() {
    this._show = false;
    this.dispatchEvent(new CustomEvent('close'));
  }
}
