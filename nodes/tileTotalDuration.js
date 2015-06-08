var straw = require('straw');

var GLOBAL_DURATION = "0";

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

    	this.opts.redis.client.incrby(this.buildTotalDurationKey(location.tileId, GLOBAL_DURATION), intDuration, function(err, globalValue) {
    		if (err) return done(new Error(err));

	    	self.opts.redis.client.incrby(self.buildTotalDurationKey(location.tileId, location.principalId), intDuration, function(err, principalValue) {
	    		if (err) return done(new Error(err));

	    		location.globalTotalDuration = globalValue;
	    		location.principalTotalDuration = principalValue;

		        self.output(location, done);
		    });
    	});
    }
});