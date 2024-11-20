/**
 *  @class
 *  @function MegaMenuSidebar
 */
if (!customElements.get('mega-menu-sidebar')) {
  class MegaMenuSidebar extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.buttons = this.querySelectorAll('.mega-menu-sidebar--button');
      this.content = this.querySelectorAll('.mega-menu-sidebar--content-inner');
      this.buttons.forEach((button, i) => {
        button.addEventListener('mouseover', (event) => {
          this.onHover(event, button, i);
        });
      });
      this.images = this.querySelectorAll('img');

      window.addEventListener('load', (event) => {
        this.images.forEach(function (image) {
          lazySizes.loader.unveil(image);
        });
      });
    }

    onHover(event, button, i) {
      this.content.forEach((content, index) => {
        content.classList.remove('active');
        if (i == index) {
          content.classList.add('active');
        }
      });
      this.buttons.forEach((this_button, index) => {
        this_button.classList.remove('active');
      });
      button.classList.add('active');
    }
  }
  customElements.define('mega-menu-sidebar', MegaMenuSidebar);
}
