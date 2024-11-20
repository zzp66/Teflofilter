/**
 *  @class
 *  @function ThemeFooter
 */

if (!customElements.get('theme-footer')) {
  class ThemeFooter extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';

      if (document.body.classList.contains('template-product-quick-view')) {
        this.animations_enabled = false;
      }
      if (!this.animations_enabled) {
        return;
      }
      this.content = document.getElementById('main-content');
      this.wrapper = document.getElementById('wrapper');
      this.footer_bg = window.getComputedStyle(document.documentElement).getPropertyValue('--color-footer-bg');
      this.radius = window.getComputedStyle(document.documentElement).getPropertyValue('--block-border-radius');
      this.setupAnimations();
    }
    setupAnimations() {
      let mm = gsap.matchMedia();
      this.wrapper.style.backgroundColor = this.footer_bg;
      mm.add({
        // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
        isDesktop: `(min-width: 768px)`,
        reduceMotion: "(prefers-reduced-motion: reduce)"
      }, (context) => {

        // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
        let {
          isDesktop,
          isMobile,
          reduceMotion
        } = context.conditions;

        gsap.to(this.content, {
          "--footer-border-radius": !isDesktop || reduceMotion ? '0px' : `${this.radius}`,
          "--footer-width-percent": !isDesktop || reduceMotion ? '0%' : '4%',
          duration: 0.5,
          inherit: false,
          ease: "none",
          modifiers: {
            "--footer-border-radius": x => Math.round(parseFloat(x)) + "px",
            "--footer-width-percent": x => Math.round(parseFloat(x) * 100) / 100 + "%"
          },
          scrollTrigger: {
            trigger: this,
            fastScrollEnd: true,
            scrub: 1,
            start: () => `top bottom`,
            end: () => `bottom bottom`
          }
        });
      });

    }
  }
  customElements.define('theme-footer', ThemeFooter);
}