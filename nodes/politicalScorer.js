var async = require('async')
  , services = require('../services')
  , straw = require('straw');

module.exports = straw.node({
    initialize: function(opts, done) {
        this.opts = opts;
        done();
    },

    buildPoliticalScoreKey: function(principalId, timespanType, timespanStart, hierarchy) {
        var month = timespanStart.getMonth() + 1;
        if (month < 10)
            month = "0" + month;

        var date = timespanStart.getDate();
        if (date < 10)
            date = "0" + date;

        var timespanStartString = timespanStart.getFullYear() + '-' + month + '-' + date;

        return "politicalScore." + principalId + "|" + timespanType + "|" + timespanStartString + "|" + hierarchy;
    },

    buildTimespanStart: function(timespanType, ts) {
        if (timespanType === 'alltime')
            return new Date(1970,1,1);
        else if (timespanType === 'year')
            return new Date(ts.getFullYear(),1,1);
        else if (timespanType === 'month')
            return new Date(ts.getFullYear(), ts.getMonth(), 1);
        else if (timespanType === 'day') {
            return new Date(ts.getFullYear(), ts.getMonth(), ts.getDate());
        }
    },

    process: function(location, done) {
        var self = this;

        var ts = new Date(location.ts);

        var totalIncrementalScore = 0.0;
        Object.keys(location.tiles).forEach(function(zoom) {
            totalIncrementalScore += location.tiles[zoom].incrementalScore;
        });

        services.tiles.findById(location.tiles[services.tiles.MAX_ZOOM].tile_id, function(err, tile) {
            if (err) return done(err);

            var hierarchy = [
                "World",
                tile.parsed.country || "",
                tile.parsed.administrative_area_level_1 || "",
                tile.parsed.administrative_area_level_2 || "",
                tile.parsed.locality || ""
            ];

            //console.dir(hierarchy);

            var hierarchyString = "";
            prefix = "";

            async.eachSeries(hierarchy, function(level, hierarchyCallback) {
                hierarchyString += prefix + level;

                var timespanTypes = ["alltime", "year", "month", "day"];
                async.each(timespanTypes, function(timespanType, timespanCallback) {
                    var timespanStart = self.buildTimespanStart(timespanType, ts);

                    var politicalScoreKey = self.buildPoliticalScoreKey(location.principalId, timespanType, timespanStart, hierarchyString);

                    self.opts.redis.client.incrbyfloat(politicalScoreKey, totalIncrementalScore, function(err, totalScore) {
                        if (err) return callback(new Error(err));

                        location[politicalScoreKey] = parseFloat(totalScore);

                        return timespanCallback();
                    });
                }, function(err) {
                    prefix = ">";
                    return hierarchyCallback(err);
                });
            }, function(err) {
                if (err) return done(err);

                self.output(location, done);
            });
        });

    }
});