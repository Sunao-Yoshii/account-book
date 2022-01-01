import { CssCommonElement } from 'bootstrap/base';
import Constants from 'common/constants';
import Brand from 'common/brand';

const selectable = [
  { label: '一般口座', value: Constants.accountType.general },
  { label: '特定口座', value: Constants.accountType.specific },
  { label: 'NISA口座', value: Constants.accountType.nisa },
  { label: '積立てNISA口座', value: Constants.accountType.reserveNisa }
];

export default class AddBrand extends CssCommonElement {
  successMessage = null;
  errorMessage = null;

  get accountTypes() {
    return selectable;
  }

  handleChange(e) {
    let fieldName = e.path[0].getAttribute('data-role');
    this[fieldName] = e.detail;
  }

  async saveAction(e) {
    this.successMessage = null;
    this.errorMessage = null;
    try {
      const form = this.template.querySelector('pages-brandForm');
      const formValue = form.getValues();
      let result = await Brand.insert(formValue.brandName, formValue.brokerageAccount, formValue.description);
      this.successMessage = '保存に成功しました。';
      const id = result.id;
      this.dispatchEvent(new CustomEvent('addbrand', { detail: id }));
    } catch (error) {
      window.console.log(error);
      this.errorMessage = '保存に失敗しました、ログを確認してください。';      
    }
  }
}
