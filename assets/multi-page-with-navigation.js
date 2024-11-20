/**
 *  @class
 *  @function MediaWithTabs
 */
if (!customElements.get('multi-page-with-navigation')) {
  class MultiPageWithNavigation extends HTMLElement {
    constructor() {
      super();

    }
    connectedCallback() {
      this.buttons = Array.from(this.querySelectorAll('.multi-page-with-navigation--button'));
      this.pages = Array.from(this.querySelectorAll('.multi-page-with-navigation--page'));
      this.buttons.forEach((button, i) => {
        button.addEventListener('click', () => {
          this.buttonClick(button, i);
        });
      });
    }
    buttonClick(button, i) {
      [].forEach.call(this.buttons, function(el) {
        el.classList.remove('active');
      });
      button.classList.add('active');
      let header_offset = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
      let page_top = this.pages[i].getBoundingClientRect().top + window.scrollY - parseInt(header_offset, 10) - 20;

      window.scrollTo({
        top: page_top,
        left: 0,
        behavior: "smooth"
      });
    }
  }
  customElements.define('multi-page-with-navigation', MultiPageWithNavigation);
}