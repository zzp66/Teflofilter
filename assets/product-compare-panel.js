/**
 *  @class
 *  @function ProductComparePanel
 */
if (!customElements.get('product-compare-panel')) {
	class ProductComparePanel extends HTMLElement {
		constructor() {
			super();
			this.toggle = this.querySelector('.compare-toggle');
			this.drawer = this.querySelector('.compare-drawer');
			this.clear = this.querySelector('.compare-clear');
			this.start = this.querySelector('.compare-start');
			this.modal = this.querySelector('.product-compare-modal');
			this.table = this.querySelector('product-compare-table');
			this.max = Number(this.dataset.max);
			this.href = '';
		}

		connectedCallback() {
			setTimeout(() => this.toggle.classList.add('compare-toggle--active'), 250);
			this.addEventListeners();
			this.updateCompareCheckboxes();
			this.updateCompareCounters();
			this.updateStartButton();
		}

		addEventListeners() {
			this.toggle.addEventListener('click', this.onButtonClick.bind(this));
			this.drawer.addEventListener('click', this.onRemoveClick.bind(this));
			this.clear.addEventListener('click', this.onClearClick.bind(this));
			this.start.addEventListener('click', this.onStartClick.bind(this));
			document.addEventListener('change', this.onCheckboxClick.bind(this));
		}

		getSelectedProducts() {
			return JSON.parse(localStorage.getItem('compare-products-vision')) || [];
		}

		addToCompare(productId, productUrl, productHandle) {
			const compareProducts = this.getSelectedProducts();
			if (!compareProducts.some(product => product.id === productId)) {
				compareProducts.push({ id: productId, url: productUrl, handle: productHandle });
				localStorage.setItem('compare-products-vision', JSON.stringify(compareProducts));
				this.updateCompareComponents();
			}
		}

		removeFromCompare(productId) {
			const compareProducts = this.getSelectedProducts().filter(product => product.id !== productId);
			localStorage.setItem('compare-products-vision', JSON.stringify(compareProducts));
			this.updateCompareComponents();
		}

		updateStartButton() {
			this.start.disabled = !this.getCompareCount();
		}

		onCheckboxClick(event) {
			if (event.target.classList.contains('product-card-compare--checkbox')) {
				const { productId, productUrl, productHandle } = event.target.dataset;
				if (event.target.checked) {
					if (this.getCompareCount() < this.max) {
						this.addToCompare(productId, productUrl, productHandle);
					}
				} else {
					this.removeFromCompare(productId);
				}
			}
		}

		updateCompareCheckboxes() {
			const compareProducts = this.getSelectedProducts();
			const compareCount = this.getCompareCount();
			document.querySelectorAll('.product-card-compare--checkbox').forEach(checkbox => {
				const isChecked = compareProducts.some(product => product.id === checkbox.dataset.productId);
				checkbox.checked = isChecked;
				checkbox.disabled = !isChecked && compareCount >= this.max;
			});
		}

		onRemoveClick(event) {
			if (event.target.classList.contains('compare-remove')) {
				const productId = event.target.dataset.productId;
				this.removeFromCompare(productId);
				event.target.closest('product-card-small').remove();
			}
		}

		onClearClick() {
			const compareProducts = this.getSelectedProducts();
			compareProducts.forEach(product => this.removeFromCompare(product.id));
			this.drawer.querySelector('.compare-drawer--list').innerHTML = '<div class="compare-drawer--list-item"></div>'.repeat(this.max);
			this.closeDrawer();
		}

		onStartClick() {
			this.modal.show();
			this.table.dispatchEvent(new CustomEvent('render-product-compare-modal', { bubbles: true }));
		}

		openDrawer() {
			this.drawer.removeAttribute('inert');
			this.drawer.focus();
			this.drawer.classList.add('active');
			document.body.classList.add('open-cc');
		}

		closeDrawer() {
			this.drawer.setAttribute('inert', '');
			this.drawer.blur();
			this.drawer.classList.remove('active');
			document.body.classList.remove('open-cc');
		}

		onButtonClick() {
			this.renderProducts();
			this.openDrawer();
		}

		getCompareCount() {
			return this.getSelectedProducts().length;
		}

		updateCompareCounters() {
			const count = this.getCompareCount();
			document.querySelectorAll('.compare-counter').forEach(counter => {
				counter.textContent = count;
			});
		}

		async renderProducts() {
			const compareProducts = this.getSelectedProducts();
			const returnArray = await Promise.all(compareProducts.map(async (product) => {
				const response = await fetch(`${product.url}?sections=product-compare-card`);
				const data = await response.json();
				return this.getSectionInnerHTML(data['product-compare-card'], '.shopify-section');
			}));

			const returnHtml = returnArray.join('') + '<div class="compare-drawer--list-item"></div>'.repeat(this.max - compareProducts.length);
			this.drawer.querySelector('.compare-drawer--list').innerHTML = returnHtml;
		}

		getSectionInnerHTML(html, selector) {
			return new DOMParser()
				.parseFromString(html, 'text/html')
				.querySelector(selector).innerHTML;
		}

		updateCompareComponents() {
			this.updateCompareCheckboxes();
			this.updateCompareCounters();
			this.updateStartButton();
		}
	}

	customElements.define('product-compare-panel', ProductComparePanel);
}
