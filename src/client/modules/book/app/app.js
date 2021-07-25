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

  handleReset() {
    this.errorMessage = null;
    this.selectedBrandId = null;
    this.loadBrands();
    this.isShowBrandForm = false;
  }

  onSelect(event) {
    this.selectedBrandId = event.detail;
  }

  onClickBrandButton() {
    this.isShowBrandForm = true;
  }
}
