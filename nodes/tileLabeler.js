var straw = require('straw')
  , Tile = require('../libs/tile');

module.exports = straw.node({
    process: function(location, done) {
        location.tileId = Tile.tileIdFromLatLong(location.latitude, location.longitude, 16);

        this.output(location);

        done();
    }
});