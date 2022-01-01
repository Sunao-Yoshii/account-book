import Ajax from 'common/ajax';

const HTTP_ENDPOINT = 'http://localhost:3002/api/v1/brand';

export default class Brand {
  static async insert(name, account, description) {
    return Ajax.put(HTTP_ENDPOINT, {
      name: name,
      account: account,
      description: description
    });
  }

  static async select(id) {
    return Ajax.get(`${HTTP_ENDPOINT}/${id}`);
  }

  static async all() {
    return Ajax.get(HTTP_ENDPOINT);
  }

  static async update(id, name, account, description) {
    return Ajax.post(`${HTTP_ENDPOINT}/${id}`, {
      name: name,
      account: account,
      description: description
    });
  }
}
