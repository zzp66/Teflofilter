/**
 *  @class
 *  @function SlideShow
 */
if (!customElements.get('slide-show')) {
  class SlideShow extends HTMLElement {
    constructor() {
      super();
      const slideshow = this;
      let
        parent_section = slideshow.closest('.shopify-section'),
        dots = slideshow.dataset.dots === 'true',
        slideshow_slides = Array.from(slideshow.querySelectorAll('.carousel__slide')),
        autoplay = slideshow.dataset.autoplay == 'false' ? false : parseInt(slideshow.dataset.autoplay, 10),
        align = slideshow.dataset.align == 'center' ? 'center' : 'left',
        fade = slideshow.dataset.fade == 'true' ? true : false,
        pageDots = slideshow.dataset.dots == 'true' ? true : false,
        prev_button = slideshow.querySelector('.flickity-prev'),
        next_button = slideshow.querySelector('.flickity-next'),
        header = document.querySelector('theme-header'),
        custom_dots = slideshow.querySelector('.flickity-custom-dots'),
        custom_navigation = slideshow.querySelector('.flickity-custom-navigation'),
        autoplay_progress = slideshow.querySelector('.slideshow--autoplay-progress'),
        progress_bar = slideshow.parentNode.querySelector('.flickity-progress--bar'),
        animations = [],
        rightToLeft = document.dir === 'rtl',
        cell_align = (align == 'left' && rightToLeft ? 'right' : 'left'),
        animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined',
        selectedIndex = 0,
        args = {
          wrapAround: true,
          cellAlign: cell_align,
          pageDots: pageDots,
          contain: true,
          fade: fade,
          autoPlay: autoplay,
          rightToLeft: rightToLeft,
          prevNextButtons: false,
          cellSelector: '.carousel__slide',
          on: {}
        };
      this.paused = false;
      if (custom_dots) {
        args.pageDots = false;
      }
      if (slideshow.classList.contains('image-with-text-slideshow--content')) {
        let main_slideshow = slideshow.parentNode.querySelector('.image-with-text-slideshow--image');
        args.draggable = false;
        args.asNavFor = main_slideshow;
      }
      if (slideshow.classList.contains('image-with-text-slideshow--image')) {
        let image_slideshow_slides = slideshow.querySelectorAll('.image-with-text-slideshow--image-media');

        if (image_slideshow_slides.length) {
          if (image_slideshow_slides[0].classList.contains('desktop-height-auto')) {
            args.adaptiveHeight = true;
          }
        }
      }
      if (slideshow.classList.contains('image-with-text-slideshow--content') ||
        slideshow.classList.contains('customer-reviews--content') ||
        slideshow.classList.contains('customer-reviews--image')) {
        args.adaptiveHeight = true;
      }
      if (slideshow.classList.contains('customer-reviews--carousel')) {
        args.wrapAround = false;
        args.adaptiveHeight = false;
        args.resize = true;
        args.on.ready = function () {
          let flkty = this;
          flkty.resize();
          document.fonts.ready.then(function () {
            flkty.resize();
          });
        };
      }
      if (slideshow.classList.contains('collection-grid__carousel')) {
        args.wrapAround = false;
      }
      // Main Slideshow
      if (slideshow.classList.contains('main-slideshow')) {

        if (animations_enabled) {
          slideshow.prepareAnimations(slideshow, animations);
        }

        args.on = {
          staticClick: function () {
            this.unpausePlayer();
          },
          ready: function () {
            let flkty = this;

            // Transparent Header padding.
            if (header) {
              if (header.classList.contains('transparent--true')) {
                let sections = Array.from(document.querySelector('#main-content').querySelectorAll(':scope > .shopify-section')),
                  i = sections.indexOf(parent_section);

                if (i == 0 && slideshow.classList.contains('section-spacing--disable-top')) {
                  slideshow.classList.add('slideshow--top');
                }
              }
            }
            // Animations.
            if (animations_enabled) {
              slideshow.animateSlides(0, slideshow, animations);
            }

            // AutoPlay Progress
            if (autoplay && autoplay_progress && animations_enabled) {
              slideshow.setupAutoplayProgress(slideshow);
            }

            // Fonts resize
            document.fonts.ready.then(function () {
              flkty.resize();
            });

            // Video Support.
            let video_container = flkty.cells[0].element.querySelector('.slideshow__slide-video-bg');
            if (video_container) {

              if (video_container.querySelector('iframe')) {
                video_container.querySelector('iframe').onload = function () {
                  slideshow.videoPlay(video_container);
                };
              } else if (video_container.querySelector('video')) {
                video_container.querySelector('video').onloadstart = function () {
                  slideshow.videoPlay(video_container);
                };
              }
            }
          },
          change: function (index) {
            let flkty = this,
              previousIndex = fizzyUIUtils.modulo(flkty.selectedIndex - 1, flkty.slides.length);

            // Animations.
            if (animations_enabled) {
              slideshow.animateReverse(previousIndex, slideshow, animations);
              slideshow.animateSlides(index, slideshow, animations);
            }

            // Color changes.
            let color_text = getComputedStyle(this.selectedElement).getPropertyValue('--color-text');
            if (autoplay_progress && animations_enabled) {
              autoplay_progress.style.setProperty('--color-body', color_text);
            }
            let dots = slideshow.querySelector('.flickity-page-dots');
            if (dots) {
              dots.style.setProperty('--color-body', color_text);
            }

            // Custom Dots.
            if (custom_navigation) {
              custom_navigation.querySelector('.flickity-custom-navigation--current').innerHTML = this.selectedIndex + 1;
            }

            // AutoPlay Progress
            if (autoplay) {

              if (flkty.player.state !== 'paused') {
                flkty.stopPlayer();
                flkty.playPlayer();
              }
            }
            if (autoplay && autoplay_progress && animations_enabled) {
              slideshow.autoPlayProgressTL.progress(0);

              if (flkty.player.state !== 'paused') {
                slideshow.autoPlayProgressTL.play();
              }
            }

            // Video Support.
            // previous slide
            let video_container_prev = flkty.cells[previousIndex].element.querySelector('.slideshow__slide-video-bg');
            if (video_container_prev) {
              slideshow.videoPause(video_container_prev);
            }
            // current slide
            let video_container = flkty.cells[index].element.querySelector('.slideshow__slide-video-bg');
            if (video_container) {
              if (video_container.querySelector('iframe')) {
                if (video_container.querySelector('iframe').classList.contains('lazyload')) {
                  video_container.querySelector('iframe').addEventListener('lazybeforeunveil', slideshow.videoPlay(video_container));
                  lazySizes.loader.checkElems();
                } else {
                  slideshow.videoPlay(video_container);
                }
              } else if (video_container.querySelector('video')) {
                slideshow.videoPlay(video_container);
              }
            }

          }
        };
        if (slideshow.classList.contains('desktop-height-image') || slideshow.classList.contains('mobile-height-image')) {
          args.adaptiveHeight = true;
        }
      }

      // Media with tabs
      if (slideshow.classList.contains('media-with-tabs--media')) {
        args.draggable = false;
        args.on = {
          staticClick: function () {
            this.unpausePlayer();
          },
          ready: function () {
            let flkty = this;

            // Video Support.
            let video_container = flkty.cells[0].element.querySelector('.media-with-tabs--media--video');
            if (video_container) {
              video_container.querySelector('video').onloadstart = function () {
                slideshow.videoPlay(video_container);
              };
            }
          },
          change: function (index) {
            let flkty = this,
              previousIndex = fizzyUIUtils.modulo(flkty.selectedIndex - 1, flkty.slides.length);

            // Video Support.
            // previous slide
            let video_container_prev = flkty.cells[previousIndex].element.querySelector('.media-with-tabs--media--video');
            if (video_container_prev) {
              slideshow.videoPause(video_container_prev);
            }
            // current slide
            let video_container = flkty.cells[index].element.querySelector('.media-with-tabs--media--video');
            if (video_container) {
              slideshow.videoPlay(video_container);
            }
          }
        };
      }

      // Announcement bar color change
      if (slideshow.classList.contains('announcement-bar--use-colors-true')) {
        args.on.change = function (index) {
          const container = slideshow.closest('.announcement-bar');
          let color_text = this.selectedElement.dataset.color,
            color_bg = this.selectedElement.dataset.bg;

          container.style.setProperty('--color-announcement-bar-bg', color_bg);
          container.style.setProperty('--color-announcement-bar-text', color_text);
        };
      }

      // Product Carousels
      if (slideshow.classList.contains('products')) {
        args.wrapAround = false;
        args.on.ready = function () {
          var flickity = this;
          if (next_button) {
            window.addEventListener('resize.center_arrows', function () {
              slideshow.centerArrows(flickity, slideshow, prev_button, next_button);
            });
          }
          window.dispatchEvent(new Event('resize.center_arrows'));
        };
      }
      if (progress_bar) {
        args.wrapAround = false;
        args.on.scroll = function (progress) {
          progress = Math.max(0, Math.min(1, progress));
          progress_bar.style.width = progress * 100 + '%';
        };
      }

      // Testimonials
      if (custom_dots) {
        args.on = {
          ready: function () {
            let flkty = this;

            // Custom Dots.
            let dots = custom_dots.querySelectorAll('li');
            dots.forEach((dot, i) => {
              dot.addEventListener('click', (e) => {
                flkty.select(i);
              });
            });
            dots[this.selectedIndex].classList.add('is-selected');
          },
          change: function (index) {

            // Custom Dots.
            let dots = custom_dots.querySelectorAll('li');
            dots.forEach((dot, i) => {
              dot.classList.remove('is-selected');
            });
            dots[this.selectedIndex].classList.add('is-selected');
          }
        };
      }

      // Customer reviews
      if (slideshow.classList.contains('customer-reviews--carousel')) {
        args.on.ready = function () {
          var flickity = this;
          if (next_button) {
            window.addEventListener('resize.center_arrows', function () {
              slideshow.centerArrows(flickity, slideshow, prev_button, next_button);
            });
          }
          window.dispatchEvent(new Event('resize.center_arrows'));
        };
      }

      // Initiate
      const flkty = new Flickity(slideshow, args);

      selectedIndex = flkty.selectedIndex;

      slideshow.dataset.initiated = true;


      // Arrows
      if (prev_button) {
        prev_button.addEventListener('click', (event) => {
          flkty.previous();
        });
        prev_button.addEventListener('keyup', (event) => {
          flkty.previous();
        });
        next_button.addEventListener('click', (event) => {
          flkty.next();
        });
        next_button.addEventListener('keyup', (event) => {
          flkty.next();
        });
      }

      // Theme editor
      if (Shopify.designMode) {
        slideshow.addEventListener('shopify:block:select', (event) => {
          let index = slideshow_slides.indexOf(event.target);
          flkty.select(index);
        });
      }

    }
    setupAutoplayProgress(slideshow) {
      slideshow.autoPlayProgressTL = gsap.timeline({
        inherit: false
      });
      slideshow.autoPlayProgressTL
        .fromTo(slideshow.querySelector('.thb-slideshow-progress--svg circle'), {
          drawSVG: 0
        }, {
          duration: parseInt(slideshow.dataset.autoplay, 10) / 1000,
          ease: 'none',
          drawSVG: true
        });
      slideshow.addEventListener('mouseenter', function () {
        slideshow.autoPlayProgressTL.pause().progress(0);
      });
      slideshow.addEventListener('mouseleave', function () {
        slideshow.autoPlayProgressTL.play();
      });
    }

    videoPause(video_container) {
      setTimeout(() => {
        video_container.querySelector('video').pause();
      }, 10);
    }
    videoPlay(video_container) {
      setTimeout(() => {
        video_container.querySelector('video').play();
      }, 10);
    }
    prepareAnimations(slideshow, animations) {
      if (!slideshow.dataset.animationsReady) {
        let splittext = new SplitText(slideshow.querySelectorAll('.slideshow__slide-heading, p:not(.subheading)'), {
          type: 'lines',
          linesClass: 'line-child'
        });
        let mask = new SplitText(slideshow.querySelectorAll('.slideshow__slide-heading, p:not(.subheading)'), {
          type: 'lines',
          linesClass: 'line-parent'
        });

        slideshow.querySelectorAll('.slideshow__slide').forEach((item, i) => {
          let tl = gsap.timeline({
            paused: true
          }),
            button_offset = 0;


          animations[i] = tl;

          if (slideshow.dataset.transition == 'zoom') {
            tl
              .to(item.querySelectorAll('.slideshow__slide-bg, .slideshow__slide-video-bg'), {
                duration: 1.5,
                scale: 1
              }, "start");
          }

          if (item.querySelector('.inline-badge')) {
            tl
              .fromTo(item.querySelector('.inline-badge'), {
                opacity: 0
              }, {
                duration: 0.5,
                opacity: 1
              }, 0);

            button_offset += 0.2;
          }
          if (item.querySelector('.subheading')) {
            tl
              .fromTo(item.querySelector('.subheading'), {
                opacity: 0
              }, {
                duration: 0.5,
                opacity: 1
              }, 0);

            button_offset += 0.5;
          }
          if (item.querySelector('.slideshow__slide-heading')) {
            let h1_duration = 1 + ((item.querySelectorAll('.slideshow__slide-heading .line-child').length - 1) * 0.1);
            tl

              .set(item.querySelectorAll('.slideshow__slide-heading'), {
                opacity: 1
              }, 0)
              .from(item.querySelectorAll('.slideshow__slide-heading .line-child'), {
                duration: h1_duration,
                yPercent: 120,
                stagger: 0.1,
                rotation: '3deg'
              }, 0);
            button_offset += h1_duration;
          }
          if (item.querySelector('p.split-text')) {

            let p_duration = 1 + ((item.querySelectorAll('p.split-text .line-child').length - 1) * 0.05);
            tl
              .set(item.querySelectorAll('p.split-text'), {
                opacity: 1
              }, 0)
              .from(item.querySelectorAll('p:not(.subheading) .line-child'), {
                duration: p_duration,
                yPercent: '120',
                stagger: 0.1,
                rotation: '3deg'
              }, 0);
            button_offset += p_duration;
          }
          if (item.querySelectorAll('.button, .text-button')) {
            tl
              .fromTo(item.querySelectorAll('.button, .text-button'), {
                y: '100%'
              }, {
                duration: 0.5,
                y: '0%',
                stagger: 0.1,
              }, button_offset * 0.2);
          }
          item.dataset.timeline = tl;
        });

        slideshow.dataset.animationsReady = true;
      }
    }
    animateSlides(i, slideshow, animations) {
      let flkty = Flickity.data(slideshow),
        active_slide = flkty.selectedElement;
      document.fonts.ready.then(function () {
        animations[i].restart();
      });
    }
    animateReverse(i, slideshow, animations) {
      animations[i].reverse();
    }
    centerArrows(flickity, slideshow, prev_button, next_button) {
      let first_cell = flickity.cells[0],
        max_height = 0,
        image_height = 0;
      if (first_cell.element.querySelector('.product-featured-image')) {
        image_height = first_cell.element.querySelector('.product-featured-image').clientHeight;
      } else if (first_cell.element.querySelector('.gallery--item')) {
        image_height = flickity.cells[1].element.querySelector('.product-featured-image').clientHeight;
      }
      if (slideshow.classList.contains('customer-reviews--carousel')) {
        if (first_cell.element.querySelector('.customer-reviews--product')) {
          image_height = flickity.cells[1].element.querySelector('.customer-reviews--product').clientHeight;
        }
      }
      if (image_height > 0) {
        flickity.cells.forEach((item, i) => {
          if (item.size.height > max_height) {
            max_height = item.size.height;
          }
        });

        if (max_height > image_height) {
          let difference = (max_height - image_height) / -2;

          prev_button.style.transform = 'translateY(' + difference + 'px)';
          next_button.style.transform = 'translateY(' + difference + 'px)';
        }
      }

    }
  }
  customElements.define('slide-show', SlideShow);
}
