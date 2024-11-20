/**
 *  @class
 *  @function MaxHeight
 */
if (!customElements.get('max-height')) {
  class MaxHeight extends HTMLElement {
    constructor() {
      super();
      this.content = this.querySelector('.max-height--inner-content');
      this.toggle = this.querySelector('.max-height--toggle');
      this.max = this.dataset.max;
    }

    connectedCallback() {
      this.toggle.addEventListener('click', this.onClick.bind(this));
      window.addEventListener('resize', this.checkVisible.bind(this));


      this.checkVisible();
    }

    checkVisible() {
      if (this.content.offsetHeight > this.max) {
        this.showToggle();
      } else {
        this.hideToggle();
      }
    }
    showToggle() {
      this.classList.add('max-height--active');
    }
    hideToggle() {
      this.classList.remove('max-height--active');
    }
    onClick() {
      this.classList.toggle('max-height--enabled');
    }
  }
  customElements.define('max-height', MaxHeight);
}
