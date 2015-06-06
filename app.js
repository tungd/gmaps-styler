/*global Ractive google*/

var Maps = google.maps;

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
  "all",
  "geometry",
  "geometry.fill",
  "geometry.stroke",
  "labels",
  "labels.icon",
  "labels.text",
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
    this.init();
    this.on('addStyle', this.addStyle.bind(this));
  },
  init: function() {
    var _this = this;

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
  addStyle: function() {
    var styles = this.get('options').styles || [];
    styles.push({
      featureType: '',
      elementType: '',
      styles: [{  }]
    })
  }
});
