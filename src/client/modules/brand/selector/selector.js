import CssCommonElement from '../../lib/common/common';
import { api, track } from 'lwc';

export default class Selector extends CssCommonElement {
  @track internalBrands = [];

  @api
  get allBrands() {
    return this.internalBrands;
  }
  set allBrands(value) {
    if (!value) {
      this.internalBrands = [];
    }
    let data = Object.assign([], value);
    data.forEach(v => Object.assign({ isSelected: false }, v));
    this.internalBrands = data;
  }

  constructor() {
    super();
  }

  onSelect(event) {
    let target = event.path[0];
    let id = target.getAttribute('data-id');
    let newArr = [];
    this.internalBrands.forEach(v => {
      let cpy = Object.assign({}, v);
      cpy.isSelected = v.id == id;
      newArr.push(cpy);
    });
    this.internalBrands = newArr;
    this.dispatchEvent(new CustomEvent('select', { detail: id }));
  }
}
