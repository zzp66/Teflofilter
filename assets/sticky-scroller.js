/**
 *  @class
 *  @function StickyScroller
 */
if (!customElements.get('sticky-scroller')) {
  class StickyScroller extends HTMLElement {

    constructor() {
      super();
      this.headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10);
      this.parent = this.parentElement;

    }

    connectedCallback() {
      this.newScrollPosition = 0;
      this.oldScrollPositon = 0;
      this.ticking = false;
      this.element = this.querySelector('.sticky-scroller--element');
      this.element.style.overflowY = 'hidden';
      this.observer = new ResizeObserver(this.onWindowScroll.bind(this));

      this.observer.observe(this.parent);
      window.addEventListener('scroll', this.onWindowScroll.bind(this), {
        passive: true
      });
    }
    onWindowScroll() {
      this.newScrollPosition = window.scrollY;

      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.translate();
          this.ticking = false;
          this.oldScrollPositon = this.newScrollPosition;
        });

        this.ticking = true;
      }
    }

    translate() {
      const parentRect = this.parentElement.getBoundingClientRect();
      const distance = this.newScrollPosition - this.oldScrollPositon;
      // Do not scroll up before sticky period
      if (parentRect.top > this.headerHeight && distance > 0) {
        return;
      }
      // Do not scroll down after sticky period
      if (parentRect.bottom < window.innerHeight && distance < 0) {
        return;
      }
      this.element.scrollTop += distance;
    }
  }
  customElements.define('sticky-scroller', StickyScroller);
}