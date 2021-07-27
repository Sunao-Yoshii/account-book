import CssCommonElement from '../../lib/common/common';
import { api, track } from 'lwc';

function toDateStr(millisec) {
  const date = new Date(millisec);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export default class Lists extends CssCommonElement {
  @track internalList = [];
  @api get purchaseList() {
    return this.internalList;
  }
  isShowUpdateForm = false;
  isShowSellForm = false;
  editTarget = null;

  set purchaseList(value) {
    let nlist = [];
    value.forEach(v => {
      let cpy = Object.assign({}, v);
      cpy.targetAmount = cpy.buyAmount * 1.2;
      cpy.createdDate = toDateStr(cpy.createdAt);
      cpy.updatedDate = toDateStr(cpy.updatedAt);
      nlist.push(cpy);
    });
    this.internalList = nlist;
  }

  handleUpdateButton(event) {
    let upTargetId = event.path[0].getAttribute('data-id');
    this.editTarget = this.internalList.filter(v => v.id == upTargetId)[0];
    this.isShowUpdateForm = true;
  }

  handleClose() {
    this.isShowUpdateForm = false;
    this.isShowSellForm = false;
  }

  handleUpdate() {
    this.isShowUpdateForm = false;
    this.isShowSellForm = false;
    this.dispatchEvent(new CustomEvent('updated'));
  }

  handleSell(event) {
    let upTargetId = event.path[0].getAttribute('data-id');
    this.editTarget = this.internalList.filter(v => v.id == upTargetId)[0];
    this.isShowSellForm = true;
  }
}
