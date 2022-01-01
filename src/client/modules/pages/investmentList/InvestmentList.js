import { CssCommonElement } from 'bootstrap/base';
import Investment from 'common/investment';
import { api, track } from 'lwc';

export default class InvestmentList extends CssCommonElement {
  @track investments = [];
  errorMessage = null;

  /** アプリケーション設定 */
  @api config;

  /** 銘柄ID */
  _brandId = null;
  @api set brandId(v) {
    this._brandId = v;
    if (this._brandId) {
      this.loadInvestments();
    }
  }
  get brandId() {
    return this._brandId;
  }

  @api refresh() {
    this.loadInvestments();
  }

  /** 購入履歴を一括取得します */
  async loadInvestments() {
    this.errorMessage = null;
    try {
      const source = await Investment.getInvestments(this._brandId);
      // TODO: 加工
      let index = 0;
      this.investments = source.map(v => {
        v.key = index++;
        return v;
      });
    } catch (error) {
      window.console.log(error);
      this.errorMessage = '投資履歴を読み込む際にエラーが発生しました。ログを確認してください。';
    }
  }
}
