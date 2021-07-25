import CssCommonElement from '../../lib/common/common';
import { api } from 'lwc';

export default class Detail extends CssCommonElement {
  @api brand;

  handleDelete() {
    let res = window.confirm('本当に削除しますか？（取り消せません）');
    if (res) {
      this.dispatchEvent(new CustomEvent('remove'));
    }
  }
}
