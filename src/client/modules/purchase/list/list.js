import CssCommonElement from '../../lib/common/common';
import { api, track } from 'lwc';

function toDateStr(millisec) {
  const date = new Date(millisec);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const SELL_RATE = 1.25;

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
      cpy.targetAmount = cpy.buyAmount * SELL_RATE;
      cpy.createdDate = toDateStr(cpy.createdAt);
      cpy.updatedDate = toDateStr(cpy.updatedAt);
      cpy.valuationGain = cpy.currentValuation - cpy.buyAmount;
      cpy.gainPercent = Math.round((cpy.currentValuation / cpy.buyAmount) * 10000) / 100;
      cpy.gainRate = Math.round((cpy.valuationGain / cpy.buyAmount) * 10000) / 100;
      cpy.style = cpy.valuationGain > 0 ? 'text-success' : 'text-danger';
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
