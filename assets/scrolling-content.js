/**
 *  @class
 *  @function ScrollingContent
 */
if (!customElements.get('scrolling-content')) {
  class ScrollingContent extends HTMLElement {
    static get observedAttributes() {
      return ['selected-index'];
    }

    constructor() {
      super();
    }

    connectedCallback() {
      this.images_container = Array.from(this.querySelectorAll('.scrolling-content--image'));
      this.first_image = this.querySelector('.scrolling-content--image.active');
      this.sections = Array.from(this.querySelectorAll('.scrolling-content--content'));
      this.dots = this.first_image.querySelectorAll('.dot');
      this.offset = '-50% 0% -50% 0%';
      this.selectedIndex = this.selectedIndex;
      this.intersectionOptions = {
        rootMargin: this.offset,
        threshold: 0
      };

      this.sections.forEach((section, i) => {
        let observer = new IntersectionObserver(
          this.handleIntersectionCallback.bind(this),
          this.intersectionOptions
        );
        observer.observe(section);
      });

      if (this.dots.length) {
        let sections = this.sections;
        this.dots.forEach((dot, i) => {
          dot.addEventListener('click', function (e) {
            let h_height = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10);
            let scrollTop = sections[i].getBoundingClientRect().top + window.scrollY - h_height;
            window.scrollTo({
              top: scrollTop,
              left: 0,
              behavior: "smooth"
            });
          });
        });
      }

    }
    handleIntersectionCallback(entries) {
      let largest = 0;
      entries.forEach((entry, i) => {
        let index = this.sections.indexOf(entry.target);
        if (index !== this.selectedIndex) {
          this.selectedIndex = index;
        }
      });

    }
    get selectedIndex() {
      return parseInt(this.getAttribute('selected-index')) || 0;
    }
    set selectedIndex(index) {
      this.setAttribute('selected-index', index);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "selected-index" && oldValue !== null && oldValue !== newValue) {
        if (this.dots.length) {
          [].forEach.call(this.dots, function (el) {
            el.classList.remove('is-selected');
          });
          this.dots[newValue].classList.add('is-selected');
        }
      }
    }
  }
  customElements.define('scrolling-content', ScrollingContent);
}