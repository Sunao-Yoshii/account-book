import { LightningElement } from 'lwc';

export default class CssCommonElement extends LightningElement {

  _bootStrapCss() {
    let _bootstrap = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css';
    const styles = document.createElement('link');
    styles.href = _bootstrap;
    styles.crossorigin = 'anonymous';
    styles.rel = 'stylesheet';
    return styles;
  }

  connectedCallback() {
    this.template.appendChild(this._bootStrapCss());
  }
    
  suspendEvent(event) {
    event.stopPropagation();
  }
}

export class Ajax {
  /**
   * get as promise
   * @param {string} url
   * @returns {Promise} 
   */
  static get(url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.onload = () => {
        if (!req.responseText) {
          resolve([]);
        }
        if (req.status >= 200 && req.status < 300) {
          resolve(JSON.parse(req.responseText));
        } else {
          console.log(`Error ocurred ${req.status} : ${req.responseText}`);
          reject(new Error(req.statusText));
        }
      };
      req.onerror = () => {
        reject(new Error(req.statusText))
      };
      req.send();
    });
  }

  /**
   * get as promise
   * @param {string} url
   * @returns {Promise} 
   */
  static delete(url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('DELETE', url, true);
      req.onload = () => {
        if (req.status >= 200 && req.status < 300) {
          resolve(JSON.parse(req.responseText));
        } else {
          console.log(`Error ocurred ${req.status} : ${req.responseText}`);
          reject(new Error(req.statusText));
        }
      };
      req.onerror = () => {
        reject(new Error(req.statusText))
      };
      req.send();
    });
  }
  
  /**
   * post as promise
   * @param {string} url
   * @param {object} params
   * @returns {Promise} 
   */
   static post(url, params) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('POST', url, true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.onload = () => {
        if (req.status >= 200 && req.status < 300) {
          resolve(JSON.parse(req.responseText));
        } else {
          console.log(`Error ocurred ${req.status} : ${req.responseText}`);
          reject(new Error(req.statusText));
        }
      };
      req.onerror = () => {
        reject(new Error(req.statusText))
      };
      req.send(JSON.stringify(params));
    });
  }
}

export class Endpoints {
  static GET_ALL_BRANDS = '/api/brands';
  static POST_CREATE_BRAND = Endpoints.GET_ALL_BRANDS;
  static GET_SINGLE_BRAND = '/api/brand/';
  static DELETE_SINGLE_BRAND = Endpoints.GET_SINGLE_BRAND;
  static GET_PURCHASES = '/api/purchase/';
  static UPDATE_PURCHASES = '/api/purchase/';
  static POST_PURCHASES = '/api/purchases';
  static POST_CURRENT_AMOUNT = '/api/currentAmount';
  static POST_SELL_API = '/api/sell';
}
