import { CssCommonElement } from 'bootstrap/base';
import { api } from 'lwc';
import Constants from 'common/constants';
import Brand from 'common/brand';
import AppConfig from 'common/AppConfig';

const brandPageButtons = [
  { id: 'edit', variant: 'primary', name: '編集', isOutline: false },
  { id: 'remove', variant: 'danger', name: '削除', isOutline: false }
];

const deleteConfirmButtons = [
  { id: 'close', variant: 'primary', isClose: true, label:'閉じる', isOutline: true },
  { id: 'remove', variant: 'danger', isClose: true, label:'削除する' }
];

const brandButtonState = (state) => {
  if (state === 'edit') {
    return [];
  } else {
    return brandPageButtons;
  }
};

export default class ShowBrand extends CssCommonElement {
  /* 変数情報 */
  brand = {
    id: 0,
    name: '',
    account: '',
    description: null
  };
  errorMessage = null;
  state = 'show';
  showDeleteConfirm = false;
  appConfig = {};

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
   * 編集/削除ボタン
   */
  get buttonGroup() {
    return brandButtonState(this.state);
  }

  /**
   * 削除確認ダイアログのボタン
   */
  get deleteConfirmButtons() {
    return deleteConfirmButtons;
  }

  /**
   * 編集モードステータス
   */
  get isEditMode() {
    return this.state === 'edit';
  }

  /**
   * 画面初期化時に、アプリケーション設定を読み込む
   */
  async loadConfig() {
    const result = await AppConfig.getConfig();
    this.appConfig = result;
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

  /**
   * 更新ボタン押下イベント
   * @param {CustomEvent} e
   */
  async handleChange(e) {
    const form = this.template.querySelector('pages-brandForm');
    const values = form.getValues();
    this.brand = {
      id: this._brandId,
      name: values.brandName,
      account: values.brokerageAccount,
      description: values.description
    };
    this.errorMessage = null;
    try {
      await Brand.update(this._brandId, values.brandName, values.brokerageAccount, values.description);
      this.state = 'show';
    } catch (error) {
      window.console.log(error);
      this.errorMessage = '';
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadConfig();
  }

  handleCreatedInvestment() {
    window.console.log('was it call?')
    // リストを更新
    const investList = this.template.querySelector('pages-investmentList');
    investList.refresh();
  }

  handleEditCancel() {
    this.state = 'show';
  }

  handleDeleteConfirmClose() {
    this.showDeleteConfirm = false;
  }

  handleSelectDeleteConfirm(e) {
    if (e.detail === 'remove') {
      // TODO: この銘柄は削除する
    }
  }

  handleClickEditRemove(event) {
    if (event.detail === 'edit') {
      this.state = 'edit';
    } else if (event.detail === 'remove') {
      this.showDeleteConfirm = true;
    }
  }
}
