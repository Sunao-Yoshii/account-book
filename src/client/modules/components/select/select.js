import { CssCommonElement } from 'bootstrap/base';
import { api } from 'lwc';

export default class Select extends CssCommonElement {
  @api value = null;
  @api label = null;
  @api options = [ { label: 'なし', value:null } ];

  get optionValues() {
    let id = 0;
    return this.options.map(v => {
      let cp = Object.assign({}, v);
      cp.id = id++;
      cp.isSelected = v === this.value;
      return cp;
    });
  }

  findSelected(event) {
    const index = event.path[0].selectedIndex;
    const str = event.path[0].options[index].value;
    return str;
  }
  
  onChange(event) {
    const selectValue = this.findSelected(event);
    this.dispatchEvent(new CustomEvent('change', { detail:selectValue }));
  }
}
