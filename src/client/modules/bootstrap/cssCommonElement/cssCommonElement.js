import { LightningElement } from 'lwc';

export default class CssCommonElement extends LightningElement {

    _bootStrapCss() {
        let _bootstrap = '../bootstrap/css/bootstrap.min.css';
        const styles = document.createElement('link');
        styles.href = _bootstrap;
        styles.rel = 'stylesheet';
        return styles;
    }

    _bootStrapIconCss() {
      let _bootstrap = '../bootstrap-icons/font/bootstrap-icons.css';
      const styles = document.createElement('link');
      styles.href = _bootstrap;
      styles.rel = 'stylesheet';
      return styles;
  }

    connectedCallback() {
        // テンプレートに無理やり Bootstrap の CSS 挿入
        this.template.appendChild(this._bootStrapIconCss());
        this.template.appendChild(this._bootStrapCss());
    }
}
