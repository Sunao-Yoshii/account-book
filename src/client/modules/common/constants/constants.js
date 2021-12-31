const AccountTypes = {
  general: 'GeneralAccount',
  specific: 'SpecificAccount',
  nisa: 'NISAAccount',
  reserveNisa: 'ResNISAAccount'
};

const AccountToLabel = {
  'GeneralAccount' : '一般口座',
  'SpecificAccount' : '特定口座',
  'NISAAccount' : 'NISA口座',
  'ResNISAAccount' : '積立てNISA口座'
};

const Constants = {
  accountType: AccountTypes,
  accountLabel: AccountToLabel
};

export default Constants;
