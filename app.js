/*global Ractive Lazy google RgbToHex*/

var Maps = google.maps,
    _ = Lazy;

// https://developers.google.com/maps/documentation/javascript/reference#MapTypeStyleFeatureType
// [].map.call(document.querySelectorAll('[summary*="MapTypeStyleFeatureType"] td:first-child code span'), function(e) { return e.innerHTML.replace(/<wbr>/g, '') })
var FEATURES = [
  "administrative",
  "administrative.country",
  "administrative.land_parcel",
  "administrative.locality",
  "administrative.neighborhood",
  "administrative.province",
  "all",
  "landscape",
  "landscape.man_made",
  "landscape.natural",
  "landscape.natural.landcover",
  "landscape.natural.terrain",
  "poi",
  "poi.attraction",
  "poi.business",
  "poi.government",
  "poi.medical",
  "poi.park",
  "poi.place_of_worship",
  "poi.school",
  "poi.sports_complex",
  "road",
  "road.arterial",
  "road.highway",
  "road.highway.controlled_access",
  "road.local",
  "transit",
  "transit.line",
  "transit.station",
  "transit.station.airport",
  "transit.station.bus",
  "transit.station.rail",
  "water"
];

// [].map.call(document.querySelectorAll('[summary*="MapTypeStyleElementType"] td:first-child code span'), function(e) { return e.innerHTML.replace(/<wbr>/g, '') })
var ELEMENTS = [
  // "all",
  // "geometry",
  "geometry.fill",
  "geometry.stroke",
  // "labels",
  // "labels.icon",
  // "labels.text",
  "labels.text.fill",
  "labels.text.stroke"
];

function formatStyleName(style) {
  return style;
}

var app = new Ractive({
  el: '#app',
  template: '#template',
  data: {
    zoom: 18,
    Maps: Maps,
    FEATURES: FEATURES,
    options: {
      zoom: 18,
      disableDefaultUI: true,
      styles: []
    },
    formatStyleName: formatStyleName
  },
  oninit: function() {
    var _this = this;
    this.initialize();
    this.on('clear', this.clear.bind(this));
    this.on('export', this.export.bind(this));
    this.on('setStyle', this.setStyle.bind(this));

    this.observe('selectedStyle', function(val) {
      var styles = _this.get('options.styles'),
          feature = _this.get('selectedFeatureType'),
          style, color, filter;

      _(ELEMENTS).each(function(element) {
        color = val[element.replace(/\./g, '_')];
        if (!color || color == '#fff') return;

        filter = { featureType: feature, elementType: element };
        style = _(styles).findWhere(filter);

        if (!style) {
          style = filter;
          styles.push(filter);
        }

        style.stylers = [{ color: RgbToHex(color) }];
      });

      _this.set('options.styles', styles);
    });
  },
  initialize: function() {
    var _this = this;

    this.set({
      selectedFeatureType: FEATURES[0],
      selectedStyle: {
        geometry: { fill: '#fff', stroke: '#fff' },
        text: { fill: '#fff', stroke: '#fff' }
      }
    });

    try {
      navigator.geolocation.getCurrentPosition(function(position) {
        _this.set('options.center', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, function() {
        throw new Error('Cannot get current location.');
      });
    } catch (e) {
      _this.set('options.center', { lat: 21, lng: 105 });
      console.error(e);
    }
  },
  clear: function() {
    this.set('options.styles', []);
  },
  export: function() {
    var styles = this.get('options.styles');
    window.open(
      'data:application/json,' + JSON.stringify(styles),
      '_blank');
  },
  setStyle: function(e) {
    console.log(JSON.parse(e.node.value));
    this.set('options.styles', JSON.parse(e.node.value));
  }
});
