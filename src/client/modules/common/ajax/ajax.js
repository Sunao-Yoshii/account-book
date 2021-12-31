export default class Ajax {

  /**
   * HTTP Get request
   * @param {String} url
   * @returns Promise(String)
   */
  static async get(url) {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.onload = function() {
        if (req.status === 200) {
          resolve(JSON.parse(req.responseText));
        } else {
          reject(new Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(new Error(req.statusText));
      };
      req.send();
    });
  }

  /**
   * HTTP Post request.
   * @param {String} url
   * @param {String} sendBody
   * @returns Promise(String)
   */
  static async post(url, sendBody) {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();
      req.open('POST', url);
      req.onload = function() {
        if (req.status === 200) {
          resolve(JSON.parse(req.responseText));
        } else {
          window.console.log(req);
          reject(new Error(req.statusText));
        }
      };
      req.onerror = function() {
        window.console.log(req);
        reject(new Error(req.statusText));
      };
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify(sendBody));
    });
  }
}
