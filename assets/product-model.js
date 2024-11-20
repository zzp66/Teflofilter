if (!customElements.get('product-model')) {
  customElements.define('product-model', class ProductModel extends HTMLElement {
    constructor() {
      super();
      const button = this.querySelector('.product-single__media-model-button');
      const remove = this.parentNode.querySelector('.product-single__media-xr-close');

      this.slider = document.querySelector('#Product-Slider');
      button.addEventListener('click', this.loadContent.bind(this));
      remove.addEventListener('click', this.unloadContent.bind(this));
    }

    loadContent() {
      if (!this.getAttribute('loaded')) {
        const content = document.createElement('div');
        content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));
        this.setAttribute('loaded', true);
        const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));

        deferredElement.focus();
      }
      Shopify.loadFeatures([
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: this.setupModelViewerUI.bind(this),
      }, ]);
      this.slider.setDraggable(false);
    }
    unloadContent() {
      this.querySelector('video, model-viewer, iframe').remove();
      this.removeAttribute('loaded');
      this.slider.setDraggable(true);
    }
    setupModelViewerUI(errors) {
      if (errors) return;

      this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'));
    }
  });
}

window.ProductModel = {
  loadShopifyXR() {
    Shopify.loadFeatures([
    {
      name: 'shopify-xr',
      version: '1.0',
      onLoad: this.setupShopifyXR.bind(this),
    }, ]);
  },
  setupShopifyXR(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () =>
        this.setupShopifyXR()
      );
      return;
    }

    document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
      modelJSON.remove();
    });
    window.ShopifyXR.setupXRElements();
  },
};

window.addEventListener('DOMContentLoaded', () => {
  if (window.ProductModel) {
    window.ProductModel.loadShopifyXR();
  }
});