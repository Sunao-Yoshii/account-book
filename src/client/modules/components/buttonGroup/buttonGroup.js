import { CssCommonElement } from 'bootstrap/base';
import { api } from 'lwc';

let toButtonStyle = (button) => {
  const isOutline = button.isOutline ? true : false;
  const variant  = button.variant ? button.variant : 'primary';
  const btnStyle = 'btn-' + (isOutline ? 'outline-' : '') + variant;
  return 'btn ' + btnStyle;
}

export default class ButtonGroup extends CssCommonElement {
  @api buttons = [];

  get buttonList() {
    let index = 1;
    return this.buttons.map(v => {
      let copy = Object.assign({}, v);
      copy.cssClass = toButtonStyle(copy);
      copy.id = copy.id || index;
      copy.name = copy.name || index;
      index++;
      return copy;
    });
  }

  handleClick(event) {
    let clickedId = event.target.getAttribute('data-id');
    this.dispatchEvent(new CustomEvent('click', { detail: clickedId }));
  }
}
