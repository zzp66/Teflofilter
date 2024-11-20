/**
 *  @class
 *  @function CouponCode
 */
if (!customElements.get('coupon-code')) {
  class CouponCode extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.clipboard = this.querySelector('.clipboard');
      this.text = this.clipboard.dataset.clipboardText;

      this.clipboard.addEventListener('click', this.onClipboardClick.bind(this));
    }
    onClipboardClick() {
      navigator.clipboard.writeText(this.text).then(() => {
        this.clipboard.classList.add('clipboard-success');
        setTimeout(() => {
          this.clipboard.classList.remove('clipboard-success');
        }, 1800);
      });
    }
  }
  customElements.define('coupon-code', CouponCode);
}