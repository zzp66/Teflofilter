/**
 *  @class
 *  @function ImageHotspots
 */
if (!customElements.get('image-hotspots')) {
  class ImageHotspots extends HTMLElement {
    constructor() {
      super();

      this.dots = this.querySelectorAll('.image-hotspots--pin');
      this.buttons = this.querySelectorAll('.image-hotspots--pin-button');
      this.animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';
      this.activeDot = this.buttons.length ? this.buttons[0] : false;

      this.dots.forEach((dot, index) => {
        this.checkCardPosition(dot);
        dot.addEventListener('click', this.onClick.bind(this, dot));

      });
    }
    connectedCallback() {
      if (this.animations_enabled) {
        this.prepareAnimations();
      }
    }
    onClick(dot) {

      this.dots.forEach((thedot, index) => {
        if (dot == thedot) {
          return;
        }
        thedot.classList.remove('active');
      });
      this.activeDot = dot;
      this.checkCardPosition(dot);
      dot.classList.toggle('active');
      if (!dot.classList.contains('active')) {
        setTimeout(() => {
          dot.classList.remove('bottom-dot');
          dot.style.setProperty('--content-offset', '0px');
        }, 350);
      }

    }
    prepareAnimations() {
      let section = this;

      this.tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 50%"
        }
      });

      this.tl
        .fromTo(this.buttons, {
          scale: 0
        }, {
          duration: 2,
          stagger: {
            each: 0.2,
            onComplete() {
              this.targets()[0].classList.add('hotspot--pinned');
            }
          },
          scale: 1,
          ease: 'elastic.out(1.2, 0.5)',
        });
    }
    checkCardPosition(dot) {
      let dotBounds = dot.querySelector('.image-hotspots--pin-bubble').getBoundingClientRect(),
        imageBounds = this.getBoundingClientRect();

      if (dotBounds.bottom > document.documentElement.clientHeight || dotBounds.bottom > imageBounds.bottom) {
        dot.classList.add('bottom-dot');
      }
      if (dotBounds.right > imageBounds.right) {
        dot.style.setProperty('--content-offset', `${imageBounds.right - dotBounds.right - 30}px`);
      } else if (dotBounds.left < imageBounds.left) {
        dot.style.setProperty('--content-offset', `${imageBounds.left - dotBounds.left + 30}px`);
      }
    }
  }
  customElements.define('image-hotspots', ImageHotspots);
}