if (!customElements.get('google-map')) {
	class GoogleMap extends HTMLElement {
		constructor() {
			super();
			this.container = this.querySelector('.google-map--map');
			const dataset = this.container.dataset;
			this.mapZoom = parseInt(dataset.mapZoom, 10);
			this.mapStyle = dataset.mapStyle;
			this.mapType = dataset.mapType;
			this.panControl = dataset.panControl;
			this.zoomControl = dataset.zoomControl;
			this.mapTypeControl = dataset.maptypeControl || false;
			this.scaleControl = dataset.scaleControl || false;
			this.streetViewControl = dataset.streetviewControl || false;
			this.locations = this.querySelectorAll('.thb-location');
			this.select = this.querySelector('.google-map--select');
			this.locationInformations = this.querySelectorAll('.google-map--location-data');
			this.index = 0;
			this.map = null;
			this.bounds = new google.maps.LatLngBounds();
		}

		connectedCallback() {
			if (!window.google) return;

			this.renderMap();
			this.addEventListeners();
			window.dispatchEvent(new Event('resize'));
		}

		addEventListeners() {
			window.addEventListener('resize', this.mapResize.bind(this));
			google.maps.event.addListenerOnce(this.map, 'tilesloaded', this.onTilesLoaded.bind(this));
			this.select.addEventListener('change', this.onSelectChange.bind(this));
		}

		onTilesLoaded() {
			if (this.mapZoom > 0) {
				this.map.setZoom(this.mapZoom);
			} else {
				this.map.fitBounds(this.bounds);
			}
			this.scrollToPin(this.index);
		}

		onSelectChange() {
			const id = this.select.value;
			this.index = this.select.selectedIndex;
			this.locationInformations.forEach(info => info.classList.remove('google-map--location-data-active'));
			this.querySelector(id).classList.add('google-map--location-data-active');
			this.scrollToPin(this.index);
		}

		getMapOptions() {
			const baseOptions = {
				zoom: this.mapZoom,
				draggable: !("ontouchend" in document),
				scrollwheel: false,
				panControl: this.panControl,
				zoomControl: this.zoomControl,
				mapTypeControl: this.mapTypeControl,
				scaleControl: this.scaleControl,
				streetViewControl: this.streetViewControl,
				fullscreenControl: false,
				mapTypeId: this.mapType,
				gestureHandling: 'cooperative'
			};

			const styles = {
				retro: [
					{
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#ebe3cd"
							}
						]
					},
					{
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#523735"
							}
						]
					},
					{
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#f5f1e6"
							}
						]
					},
					{
						"featureType": "administrative",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#c9b2a6"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#dcd2be"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#ae9e90"
							}
						]
					},
					{
						"featureType": "landscape.natural",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#dfd2ae"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#dfd2ae"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#93817c"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#a5b076"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#447530"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#f5f1e6"
							}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#fdfcf8"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#f8c967"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#e9bc62"
							}
						]
					},
					{
						"featureType": "road.highway.controlled_access",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#e98d58"
							}
						]
					},
					{
						"featureType": "road.highway.controlled_access",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#db8555"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#806b63"
							}
						]
					},
					{
						"featureType": "transit.line",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#dfd2ae"
							}
						]
					},
					{
						"featureType": "transit.line",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#8f7d77"
							}
						]
					},
					{
						"featureType": "transit.line",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#ebe3cd"
							}
						]
					},
					{
						"featureType": "transit.station",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#dfd2ae"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#b9d3c2"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#92998d"
							}
						]
					}
				],
				night: [
					{
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#242f3e"
							}
						]
					},
					{
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#746855"
							}
						]
					},
					{
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#242f3e"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "administrative.locality",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#d59563"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#d59563"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#263c3f"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#6b9a76"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#38414e"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#212a37"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#9ca5b3"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#746855"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#1f2835"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#f3d19c"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "transit",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#2f3948"
							}
						]
					},
					{
						"featureType": "transit.station",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#d59563"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#17263c"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#515c6d"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#17263c"
							}
						]
					}
				]
			};

			if (styles[this.mapStyle]) {
				baseOptions.styles = styles[this.mapStyle];
			}

			return baseOptions;
		}

		renderMap() {
			const mapOptions = this.getMapOptions();
			this.map = new google.maps.Map(this.container, mapOptions);
			this.locations.forEach((location, i) => {
				this.renderMarker(i, location);
				location.dataset.rendered = 'true';
			});
		}

		mapResize() {
			setTimeout(() => {
				this.scrollToPin(this.index);
			}, 50);
		}

		renderMarker(index, location) {
			const options = JSON.parse(location.dataset.option);
			const latlng = new google.maps.LatLng(options.latitude, options.longitude);
			location.dataset.latlng = latlng;
			this.bounds.extend(latlng);

			const pinimageLoad = new Image();
			pinimageLoad.src = options.marker_image;

			pinimageLoad.addEventListener('load', () => {
				this.setMarker(index, latlng, options);
			});
		}

		setMarker(index, latlng, options) {
			const markerSize = options.retina_marker && !options.rendered ? [options.marker_size[0] / 2, options.marker_size[1] / 2] : options.marker_size;

			class CustomMarker extends google.maps.OverlayView {
				constructor(latlng, map) {
					super();
					this.latlng = latlng;
					this.setMap(map);
				}

				draw() {
					if (!this.div_) {
						this.div_ = document.createElement('div');
						this.div_.classList.add('thb-pin');
						this.div_.innerHTML = `
							<div class="pulse"></div>
							<div class="shadow"></div>
							<div class="pin-wrap"><img src="${options.marker_image}" width="${markerSize[0]}" height="${markerSize[1]}" /></div>`;
						this.div_.style.position = 'absolute';
						this.div_.style.cursor = 'pointer';

						const panes = this.getPanes();
						panes.overlayImage.appendChild(this.div_);

						this.div_.addEventListener('click', () => {
							this.map.querySelectorAll('.google-map--location-data details').forEach(detail => detail.removeAttribute('open'));
							this.map.querySelectorAll('.google-map--location-data')[index].querySelector('details').setAttribute('open', '');
						});
					}

					const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
					if (point) {
						const shadowOffset = (markerSize[0] - 39) / 2;
						this.div_.style.left = `${point.x - (markerSize[0] / 2)}px`;
						this.div_.style.top = `${point.y - (markerSize[1] / 2)}px`;
						this.div_.style.width = `${markerSize[0]}px`;
						this.div_.style.height = `${markerSize[1]}px`;
						this.div_.querySelector('.shadow').style.marginLeft = `${shadowOffset}px`;
						this.div_.querySelector('.pulse').style.marginLeft = `${shadowOffset}px`;
					}
				}

				getPosition() {
					return this.latlng;
				}
			}

			new CustomMarker(latlng, this.map);
		}

		scrollToPin(index) {
			const location = this.locations[index];
			const options = JSON.parse(location.dataset.option);
			const latlng = new google.maps.LatLng(options.latitude, options.longitude);
			this.map.setZoom(this.mapZoom);
			this.map.panTo(latlng);
		}
	}

	customElements.define('google-map', GoogleMap);
}

