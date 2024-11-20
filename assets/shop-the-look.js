/**
 *  @class
 *  @function ShopTheLook
 */
if (!customElements.get('shop-the-look')) {
  class ShopTheLook extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
    }
  }
  customElements.define('shop-the-look', ShopTheLook);
}