import CssCommonElement from 'bootstrap/cssCommonElement';
import { track } from 'lwc';
import Brand from 'common/brand';

const MODE_DASHBOARD = 1;
const MODE_CONFIG = 2;
const MODE_ADD_BRAND = 3;
const MODE_SHOW_BRAND = 4;

export default class App extends CssCommonElement {

  @track allBrands = [];

  errorMessage = null;
  mode = MODE_DASHBOARD;
  showBrandId = null;

  connectedCallback() {
    super.connectedCallback();
    this.loadAllBrands();
  }

  async loadAllBrands() {
    this.errorMessage = null;
    try {
      this.allBrands = await Brand.all();
    } catch (error) {
      window.console.log(error);
      this.errorMessage = 'ブランドの一覧取得に失敗しました。ログを確認してください。';
    }
  }

  get showConfig() {
    return this.mode === MODE_CONFIG;
  }

  get showCreateBrand() {
    return this.mode === MODE_ADD_BRAND;
  }

  get showBrand() {
    return this.mode === MODE_SHOW_BRAND;
  }

  clickDashboard() {
    this.mode = MODE_DASHBOARD;
  }

  clickAddBrand() {
    this.mode = MODE_ADD_BRAND;
  }

  clickConfig() {
    this.mode = MODE_CONFIG;
  }

  clickBrandName(e) {
    this.showBrandId = e.target.getAttribute('data-id');
    this.mode = MODE_SHOW_BRAND;
  }

  async handleBrandCreated(event) {
    await this.loadAllBrands();
    if (this.errorMessage) {
      return;
    }
    this.showBrandId = event.detail;
    this.mode = MODE_SHOW_BRAND;
  }
}
