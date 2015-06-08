var straw = require('straw')
  , Tile = require('../libs/tile');

module.exports = straw.node({
    process: function(msg, done) {
    	msg.tileId = Tile.tileIdFromLatLong(msg.latitude, msg.longitude, 16);
    	this.output(msg);
    	done();
    }
});