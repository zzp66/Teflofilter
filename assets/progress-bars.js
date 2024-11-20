/**
 *  @class
 *  @function ProgressBars
 */
if (!customElements.get('progress-bars')) {
  class ProgressBars extends HTMLElement {
    constructor() {
      super();
      this.bars = this.querySelectorAll('.progress-bars--single');
      this.progresses = this.querySelectorAll('.progress-bars--progress');
      this.animatations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';
      this.tl = false;
    }
    connectedCallback() {
      if (this.animatations_enabled) {
        this.prepareAnimations();
      }
    }
    disconnectedCallback() {
      if (this.animatations_enabled) {
        this.tl.kill();
      }
    }
    prepareAnimations() {
      let section = this;

      this.tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%"
        }
      });

      section.tl
        .fromTo(this.bars, {
          '--final-position': '100%',
          '--percent-value': '0',
          '--percent-position': '0%'
        }, {
          duration: 1,
          stagger: 0.1,
          roundProps: '--percent-value',
          ease: 'power3.out',
          '--final-position': function(index, target) {
            let final = 100 - parseInt(target.dataset.position, 10);
            return final + '%';
          },
          '--percent-value': function(index, target) {
            let final = parseInt(target.dataset.position, 10);
            return final;
          },
          '--percent-position': function(index, target) {
            let final = target.dataset.position;
            return final + '%';
          },
        });
    }
  }
  customElements.define('progress-bars', ProgressBars);
}