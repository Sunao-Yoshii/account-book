import CssCommonElement, { Ajax, Endpoints } from '../../lib/common/common';
import { track } from 'lwc';

export default class App extends CssCommonElement {
  isShowBrandForm;
  errorMessage;
  selectedBrandId;
  @track allBrands;

  get hasError() {
    return this.errorMessage;
  }

  constructor() {
    super();
    this.isShowBrandForm = false;
    this.allBrands = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadBrands();
  }

  async loadBrands() {
    try {
      let brands = await Ajax.get(Endpoints.GET_ALL_BRANDS);
      brands.forEach(v => { v.isSelected = false; });
      this.allBrands = brands;
    } catch (error) {
      this.errorMessage = '銘柄の読み込みに失敗しました。画面をリロードしてください。';
    }
  }

  async handleRefresh() {
    const brandId = this.selectedBrandId;
    console.log(Object.assign({}, brandId));

    this.errorMessage = null;
    this.isShowBrandForm = false;
    await this.handleReset();
  }

  async handleReset() {
    this.errorMessage = null;
    this.selectedBrandId = null;
    this.isShowBrandForm = false;
    this.loadBrands();
  }

  onSelect(event) {
    this.selectedBrandId = event.detail;
  }

  onClickBrandButton() {
    this.isShowBrandForm = true;
  }
}
