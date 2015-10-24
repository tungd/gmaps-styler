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


Ractive.components['colorpicker'] = Ractive.extend({
  template: '#colorpicker',
  isolated: true,
  oninit: function() {
    this.set({
      picking: false,
      value: this.get('value') || '#fff',
      size: this.get('width') || 240,
      RgbToHex: RgbToHex
    });

    this.on('pick', this.pick.bind(this));
    this.on('preview', this.preview.bind(this));
    this.on('start', this.start.bind(this));
    this.on('end', this.end.bind(this));
    this.on('toggle', this.toggle.bind(this));
    this.on('pickHex', this.pickHex.bind(this));

    // document.addEventListener('click', this.end.bind(this), true);
  },
  onrender: function() {
    this.draw(this.find('.colorpicker__pallete'));
  },
  toggle: function() {
    this.fire(this.get('picking') ? 'end' : 'start');
  },
  start: function() {
    this.set('picking', true);
  },
  end: function() {
    this.set('picking', false);
  },
  preview: function(e) {
    var x = e.original.layerX, y = e.original.layerY,
        size = this.get('size');

    this.set({
      value: Rgb(x, y, size, size)
    });
  },
  pick: function(e) {
    this.preview(e);
    this.fire('end');
  },
  pickHex: function(e) {
    this.set({
      value: HexToRgb(e.node.value)
    });
    this.fire('end');
  },
  draw: function(canvas) {
    var ctx = canvas.getContext('2d'),
        x, width = canvas.width,
        y, height = canvas.height,
        data = ctx.createImageData(width, height),
        pixels = data.data,
        i = 0, rgb;

    for (y = 0; y < height; y += 1) {
      for (x = 0; x < width; x += 1, i += 4) {
        rgb = Rgb(x, y, width, height);

        pixels[i] = rgb[0];
        pixels[i + 1] = rgb[1];
        pixels[i + 2] = rgb[2];
        pixels[i + 3] = rgb[3] == 0 ? 0 : 255;
      }
    }

    ctx.putImageData(data, 0, 0);
  }
});

var Memoized = function(fn, self) {
  var key, cache = {};

  return function() {
    key = [].slice.call(arguments).join('@');
    if (!cache[key]) {
      cache[key] = fn.apply(self, arguments);
    }
    return cache[key];
  };
};

var Rgb = (function() {
  var TAU = Math.PI * 2,
      hue, sat, d, rx, ry, r;

  function _Rgb(x, y, w, h) {
    rx = x - w / 2 | 0;
    ry = y - h / 2 | 0;
    r = w / 2.1;
    d = rx * rx + ry * ry;

    if (d < r * r) {
      hue = 6 * (Math.atan2(ry, rx) + Math.PI) / TAU;
      sat = Math.sqrt(d) / r;

      return HslToRgb(hue, sat, 255);
    }

    return [0, 0, 0, 0];
  }

  return Memoized(_Rgb);
}());

var HslToRgb = (function() {
  var g, f, u, v, w, _r, _g, _b;

  function _HslToRgb(hue, sat, l) {
    g = Math.floor(hue);
    f = hue - g;
    u = l * (1 - sat);
    v = l * (1 - sat * f);
    w = l * (1 - sat * (1 - f));
    _r = [l, v, u, u, w, l, l][g] | 0;
    _g = [w, l, l, v, u, u, w][g] | 0;
    _b = [u, u, w, l, l, v, u][g] | 0;

    return [_r, _g, _b];
  }

  return Memoized(_HslToRgb);
}());

var RgbToHex = (function() {
  function _RgbToHex(r, g, b) {
    if (arguments.length == 1) {
      g = r[1];
      b = r[2];
      r = r[0];
    }

    return [
      '#',
      ('00' + Number(r).toString(16)).substr(-2),
      ('00' + Number(g).toString(16)).substr(-2),
      ('00' + Number(b).toString(16)).substr(-2)
    ].join('');
  }

  return Memoized(_RgbToHex);
})();

var HexToRgb = (function() {
  function _HexToRgb(hex) {
    if (hex.lastIndexOf('#') > -1) {
      hex = hex.replace(/#/, '0x');
    } else {
      hex = '0x' + hex;
    }

    return [
      hex >> 16,
      (hex & 0x00FF00) >> 8,
      hex & 0x0000FF
    ];
  }

  return Memoized(_HexToRgb);
}());
