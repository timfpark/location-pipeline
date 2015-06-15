var async = require('async')
  , straw = require('straw');

module.exports = straw.node({
    score: function(seconds, rarenessFactor) {
        var days = seconds / (3600.0 * 24.0);
        return rarenessFactor * 0.125 * Math.log(4.0 * Math.pow(days, 2) + 1.0) + 4 * Math.atan(2 * days);
    },

    buildTileScoreKey: function(tileId, principalId) {
        return "tileScore." + tileId + "." + principalId;
    },

    process: function(location, done) {
        var self = this;

        var zoomLevels = Object.keys(location.tiles);
        async.each(zoomLevels, function(zoom, zoomCallback) {
            var tile = location.tiles[zoom];

            tile.rarenessFactor = 1.0 //self.durationMedians[zoom] / tile.globalDuration;

            tile.totalScore = self.score(tile.principalDuration, tile.rarenessFactor);
            tile.incrementalScore = tile.totalScore - self.score(tile.principalDuration - location.duration, tile.rarenessFactor);

            var tileScoreKey = self.buildTileScoreKey(tile.tile_id, location.principalId);

            self.opts.redis.client.set(tileScoreKey, tile.totalScore, zoomCallback);
        }, function(err) {
            if (err) return done(err);

            self.output(location, done);
        });
    }
});