/*global Ractive google*/

var Maps = google.maps;

Ractive.components["map"] = Ractive.extend({
  template: '#map',
  isolated: true,
  onrender: function() {
    var _this = this,
        map = new Maps.Map(
          this.find('.map-canvas'), this.get('options'));

    Maps.event.addListener(map, 'center_changed', function() {
      var center = map.getCenter();

      _this.set('options.center', {
        lat: center.lat(), lng: center.lng()
      });
    });

    window._map = map;

    this.observe('options', function(options) {
      map.setOptions(options);
    });
  }
});
