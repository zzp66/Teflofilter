/**
 *  @class
 *  @function Gallery
 */
if (!customElements.get('theme-gallery')) {
  class ThemeGallery extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.galleryVideoList = Array.from(this.querySelectorAll('.gallery--item .gallery__video'));

      this.hoverPlayList = this.galleryVideoList.filter((item) => {
        return item.classList.contains('hover-play') && item;
      });

      this.autoPlayList = this.galleryVideoList.filter((item) => {
        return !item.classList.contains('hover-play') && item;
      });

      this.autoPlayList.forEach((item, i) => {
        item.querySelector('video').play();
      });

      this.setHoverPlayList();
    }
    setHoverPlayList() {
      this.hoverPlayList.forEach((item, i) => {
        item.querySelector('video').currentTime = 0.1;
        item.parentElement.addEventListener('mouseenter', () => this.playVideo(item));
        item.parentElement.addEventListener('mouseleave', () => this.pauseVideo(item));
      });
    }

    playVideo(videoContainer) {
      videoContainer.querySelector('video').play();
    }
    pauseVideo(videoContainer) {
      videoContainer.querySelector('video').pause();
    }
  }
  customElements.define('theme-gallery', ThemeGallery);
}