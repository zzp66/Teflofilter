/**
 *  @class
 *  @function BackToTop
 */
if (!customElements.get('search-form')) {
  class SearchForm extends HTMLElement {
    constructor() {
      super();

    }
    connectedCallback() {
      this.is_drawer = this.dataset.drawer;
      this.drawer = this.closest('#Search-Drawer');
      this.form = this.querySelector('form');
      this.button = document.querySelectorAll('.thb-quick-search');
      this.input = this.querySelector('.search-field');
      this.defaultTab = this.querySelector('.side-panel-content--initial');
      this.predictiveSearchResults = this.querySelector('.thb-predictive-search');
      this.cc = this.querySelector('.searchform--click-capture');

      this.setupEventListeners();
    }

    setupEventListeners() {
      this.form.addEventListener('submit', this.onFormSubmit.bind(this));

      this.input.addEventListener('input', debounce((event) => {
        this.onChange(event);
      }, 300).bind(this));
      this.input.addEventListener('focus', debounce((event) => {
        this.onChange(event);
      }, 300).bind(this));

      this.button.forEach((item, i) => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          document.body.classList.add('open-cc');
          if (this.is_drawer) {
            this.drawer.classList.add('active');
          }
          return false;
        });
      });

      this.cc?.addEventListener('click', this.close.bind(this));

      document.addEventListener('keyup', (e) => {
        if (e.code && e.code.toUpperCase() === 'ESCAPE') {
          this.close();
        }
      });
    }

    getQuery() {
      return this.input.value.trim();
    }

    onChange() {
      const searchTerm = this.getQuery();

      if (!searchTerm.length) {
        if (!this.is_drawer) {
          this.close();
        }
        return;
      }
      if (!this.is_drawer) {
        this.open();
      }
      this.predictiveSearchResults.classList.add('active');
      this.getSearchResults(searchTerm);
    }

    onFormSubmit(event) {
      if (!this.getQuery().length) {
        event.preventDefault();
      }
    }

    onFocus() {
      const searchTerm = this.getQuery();

      if (!searchTerm.length) {
        this.predictiveSearchResults.innerHTML = '';
        return;
      }

      this.getSearchResults(searchTerm);
    }

    getSearchResults(searchTerm) {

      this.predictiveSearchResults.classList.add('loading');

      fetch(`${theme.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent('resources[type]')}=product,article,query,page&${encodeURIComponent('resources[limit]')}=10&section_id=predictive-search`)
        .then((response) => {
          this.predictiveSearchResults.classList.remove('loading');
          if (!response.ok) {
            var error = new Error(response.status);
            throw error;
          }

          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;

          this.renderSearchResults(resultsMarkup);
        })
        .catch((error) => {
          throw error;
        });
    }

    renderSearchResults(resultsMarkup) {
      this.predictiveSearchResults.innerHTML = resultsMarkup;
      if (!this.is_drawer) {
        this.predictiveSearchResults.querySelector('#search-results-submit').classList.remove('button');
      }
      this.predictiveSearchResults.querySelector('#search-results-submit').addEventListener('click', () => {
        this.form.submit();
      });
    }

    close() {
      console.log('close');
      this.predictiveSearchResults.setAttribute('inert', '');
      document.body.classList.remove('open-search');
    }
    open() {
      document.body.classList.add('open-search');
      this.predictiveSearchResults.removeAttribute('inert');
    }
  }
  customElements.define('search-form', SearchForm);
}