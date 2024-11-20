/**
 *  @class
 *  @function TermsCheckbox
 */
if (!customElements.get('terms-checkbox')) {
  class TermsCheckbox extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.append = this.dataset.append;
      this.terms_checkbox = this.querySelector(`#CartTerms${this.append}`);
      this.checkout_button = this.parentNode.querySelector('.button.checkout-button');
      if (this.terms_checkbox && this.checkout_button) {
        this.terms_checkbox.setCustomValidity(theme.strings.requiresTerms);
        this.checkout_button.addEventListener('click', (e) => {
          if (!this.terms_checkbox.checked) {
            this.terms_checkbox.reportValidity();
            this.terms_checkbox.focus();
            e.preventDefault();
          }
        });
      }
    }
  }
  customElements.define('terms-checkbox', TermsCheckbox);
}
