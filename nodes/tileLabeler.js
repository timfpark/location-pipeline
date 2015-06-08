var straw = require('straw')
  , Tile = require('../libs/tile');

var MIN_ZOOM = 16;
var MAX_ZOOM = 16;

module.exports = straw.node({
    process: function(location, done) {
        for (var zoom = MIN_ZOOM; zoom <= MAX_ZOOM; zoom++) {
            location.tileId = Tile.tileIdFromLatLong(location.latitude, location.longitude, zoom);

            this.output(location, done);
        }
    }
});