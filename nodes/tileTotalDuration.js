var async = require('async')
  , straw = require('straw');

var GLOBAL_DURATION = "GLOBAL";
var GLOBAL_TOTAL_DURATION = "tileTotalDuration.GLOBAL";

module.exports = straw.node({
    initialize: function(opts, done) {
        this.opts = opts;
        done();
    },

    buildTotalDurationKey: function(tileId, principalId) {
    	return "tileTotalDuration." + tileId + "." + principalId;
    },

    process: function(location, done) {
        var self = this;
        var intDuration = Math.round(location.duration);

        self.opts.redis.client.incrby(GLOBAL_TOTAL_DURATION, intDuration, function(err, globalOverall) {
            if (err) return callback(new Error(err));

            location.globalDuration = globalOverall;

            async.each(Object.keys(location.tiles), function(zoom, callback) {
                var tile = location.tiles[zoom];

                self.opts.redis.client.incrby(self.buildTotalDurationKey(tile.tile_id, GLOBAL_DURATION), intDuration, function(err, globalValue) {
                    if (err) return callback(new Error(err));

                    self.opts.redis.client.incrby(self.buildTotalDurationKey(tile.tile_id, location.principalId), intDuration, function(err, principalValue) {
                        if (err) return callback(new Error(err));

                        tile.globalDuration = globalValue;
                        tile.principalDuration = principalValue;

                        return callback();
                    });
                });
            }, function(err) {
                if (err) return callback(new Error(err));

                self.output(location, done);
            });
        });
    }
});