import { CssCommonElement } from 'bootstrap/base';
import { api } from 'lwc';
import Constants from 'common/constants';

const selectable = [
  { label: '一般口座', value: Constants.accountType.general },
  { label: '特定口座', value: Constants.accountType.specific },
  { label: 'NISA口座', value: Constants.accountType.nisa },
  { label: '積立てNISA口座', value: Constants.accountType.reserveNisa }
];

export default class BrandForm extends CssCommonElement {
  @api brandName = null;
  @api brokerageAccount = selectable[0].value;
  @api description = null;
  
  get accountTypes() {
    return selectable;
  }

  handleChange(e) {
    let fieldName = e.path[0].getAttribute('data-role');
    this[fieldName] = e.detail;
  }

  @api getValues() {
    return {
      brandName: this.brandName,
      brokerageAccount: this.brokerageAccount,
      description: this.description
    };
  }
}
