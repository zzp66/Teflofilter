/**
 *  @class
 *  @function SocialShare
 */
if (!customElements.get('social-share')) {
  class SocialShare extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.links = this.querySelectorAll('.social:not(.clipboard):not(.whatsapp)');
      this.clipboard = this.querySelector('.social.clipboard');

      this.clipboard?.addEventListener('click', this.onClipboardClick.bind(this));
      this.setupEventListeners();
    }
    onClipboardClick() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.clipboard.classList.add('clipboard-success');
        setTimeout(() => {
          this.clipboard.classList.remove('clipboard-success');
        }, 1800);
      });
    }
    setupEventListeners() {
      this.links.forEach((link) => {
        link.addEventListener('click', (event) => {
          let left = (screen.width / 2) - (640 / 2),
            top = (screen.height / 2) - (440 / 2) - 100;
          window.open(link.getAttribute('href'), 'mywin', 'left=' + left + ',top=' + top + ',width=640,height=440,toolbar=0');
          event.preventDefault();
        });
      });
    }
  }
  customElements.define('social-share', SocialShare);
}