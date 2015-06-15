var straw = require('straw')
  , Tile = require('geotile');

var MIN_ZOOM = 4;
var MAX_ZOOM = 16;

module.exports = straw.node({
    process: function(location, done) {
        location.tiles = {};

        for (var zoom = MIN_ZOOM; zoom <= MAX_ZOOM; zoom++) {
            location.tiles[zoom] = {
                tile_id: Tile.tileIdFromLatLong(location.latitude, location.longitude, zoom)
            }
        }

        this.output(location, done);
    }
});