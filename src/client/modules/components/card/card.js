import CssCommonElement from 'bootstrap/cssCommonElement';
import { api } from 'lwc';

export default class Card extends CssCommonElement {
  @api cssStyle = '';
  @api title = null;
  @api subtitle = null;
}
