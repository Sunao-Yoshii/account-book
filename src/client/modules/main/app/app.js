import CssCommonElement from 'bootstrap/cssCommonElement';

const MODE_DASHBOARD = 1;
const MODE_CONFIG = 2;

export default class App extends CssCommonElement {

  mode = MODE_DASHBOARD;

  clickDashbord() {
    this.mode = MODE_DASHBOARD;
  }

  clickConfig() {
    mode = MODE_CONFIG;
  }
}
