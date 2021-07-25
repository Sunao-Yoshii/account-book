import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';
import { api, track } from 'lwc';

export default class RightContent extends CssCommonElement {
  _setBrandId;

  @api
  get selectedId() {
    return this._setBrandId;
  }
  set selectedId(idVal) {
    this._setBrandId = idVal;
    this.loadBrand();
  }

  @track purchaseList = [];
  brand;
  errorMessage;

  constructor() {
    super();
    this.errorMessage = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadBrand();
  }

  handleRemove() {
    Ajax.delete(Endpoints.DELETE_SINGLE_BRAND + this._setBrandId)
      .then(success => {
        this.dispatchEvent(new CustomEvent('removed'));
      }, error => {
        this.errorMessage = JSON.stringify(error);
      });
  }

  handleSubmit() {
    this.loadBrand();
  }

  async loadBrand() {
    if (!this._setBrandId) {
      return;
    }

    try {
      let brands = await Ajax.get(Endpoints.GET_SINGLE_BRAND + this._setBrandId);
      this.brand = brands[0];

      const data = await Ajax.get(Endpoints.GET_PURCHASES + this._setBrandId);
      data.forEach(v => {
        v.targetAmount = v.buyAmount * 1.2;
      });
      this.purchaseList = data;

      this.errorMessage = null;
    } catch (error) {
      console.log(error);
      this.errorMessage = JSON.stringify(error);
    }
  }
}