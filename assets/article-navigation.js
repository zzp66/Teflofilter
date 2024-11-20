/**
 *  @class
 *  @function ArticleNavigation
 */
if (!customElements.get('article-navigation')) {
  class ArticleNavigation extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      window.setTimeout(() => {
        this.progress_bar = document.getElementById('progress-bar');
        this.article_element = document.getElementById('main-article');
        this.title_element = document.getElementById('post-title-wrapper');

        // append a scroll event listener to the window object
        window.addEventListener('scroll', this.setStickyClass.bind(this));
        window.addEventListener('scroll', this.stretch.bind(this));
        window.dispatchEvent(new Event('scroll'));
      });
    }
    stretch() {
      const pixelScrolled = window.scrollY - (this.article_element.getBoundingClientRect().top + window.scrollY) - (this.title_element.getBoundingClientRect().top + window.scrollY) + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10);

      // convert pixels to percentage
      const pixelsToPercentage = Math.max(pixelScrolled / this.article_element.offsetHeight, 0);

      // set the width of the fluid element.
      this.progress_bar.style.transform = 'scale(' + pixelsToPercentage + ', 1)';
    }
    setStickyClass() {
      let title_offset = this.title_element.getBoundingClientRect().top + window.scrollY + this.title_element.offsetHeight,
        article_offset = this.article_element.getBoundingClientRect().top + window.scrollY + this.article_element.offsetHeight;
      if (window.scrollY > title_offset) {
        this.classList.add('navigation--sticky');
      } else {
        this.classList.remove('navigation--sticky');
      }
      if (window.scrollY > article_offset) {
        this.classList.remove('navigation--sticky');
      }
    }
  }
  customElements.define('article-navigation', ArticleNavigation);
}