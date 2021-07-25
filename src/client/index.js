
import { createElement } from 'lwc';
import EntryApp from 'book/app';

const app = createElement('account-book', { is: EntryApp });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
