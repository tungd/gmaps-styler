/*global Ractive google*/

var Maps = google.maps;

Ractive.components['map'] = Ractive.extend({
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


Ractive.components['collapsible'] = Ractive.extend({
  template: '#collapsible',
  isolated: true,
  oninit: function() {
    this.set({ collapsed: false });
    this.on('toggle', this.toggle.bind(this));
  },
  toggle: function() {
    this.set('collapsed', !this.get('collapsed'));
  }
});
