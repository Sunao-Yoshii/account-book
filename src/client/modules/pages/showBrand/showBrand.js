import { CssCommonElement } from 'bootstrap/base';
import { api } from 'lwc';
import Constants from 'common/constants';
import Brand from 'common/brand';

export default class ShowBrand extends CssCommonElement {
  /* 変数情報 */
  brand = {
    id: 0,
    name: '',
    account: '',
    description: null
  };
  errorMessage = null;

  /* 銘柄情報表示 */
  get title() {
    return this.brand.name;
  }
  get account() {
    return this.brand.account;
  }
  get description() {
    return this.brand.description;
  }

  /* 銘柄ID */
  _brandId = null;
  @api set brandId(v) {
    this._brandId = v;
    if (this._brandId) {
      this.loadBrand(v);
    }
  }
  get brandId() {
    return this._brandId;
  }

  /**
   * 画面ヘッダでの表示名称
   */
  get headerTitle() {
    return `[${this.accountName}] ${this.title}`;
  }

  /**
   * 口座名称
   */
  get accountName() {
    if (this.account) {
      return Constants.accountLabel[this.account];
    }
    return '';
  }

  /**
   * 非同期に銘柄情報を取得する
   * @param {String} id 
   */
  async loadBrand(id) {
    try {
      this.brand = await Brand.select(id);
    } catch (error) {
      window.console.log(error);
      this.errorMessage = '銘柄の読み込みに失敗しました。ログを確認してください。';
    }
  }
}
