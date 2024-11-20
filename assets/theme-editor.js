window.addEventListener('load', () => {

  document.addEventListener('shopify:section:load', function (event) {
    const section = event.target;

    if (section.classList.contains('product-section') || section.classList.contains('section-collection-tabs') || section.classList.contains('section-image-with-text-slideshow') || section.classList.contains('section-media-with-tabs') || section.classList.contains('section-customer-reviews') || section.classList.contains('section-testimonials')) {
      window.dispatchEvent(new Event('resize'));
    }

    if (section.classList.contains('section-slideshow')) {
      window.dispatchEvent(new Event('resize'));
    }
  });
});