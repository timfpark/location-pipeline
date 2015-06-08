var redis = require('redis')
  , straw = require('straw')

module.exports = straw.node({
    initialize: function(opts, done) {
        this.opts = opts;

        this.redisClient = redis.createClient();

        done();
    },

    buildLastLocationKey: function(location) {
    	return "lastLocation." + location.principalId;
    },

    process: function(currentLocation, done) {
    	var self = this;

        this.redisClient.get(this.buildLastLocationKey(currentLocation), function(err, lastLocation) {
            if (lastLocation) {
	        	lastLocation = JSON.parse(lastLocation);
                lastLocation.duration = currentLocation.ts - lastLocation.ts;
            }

            self.redisClient.set(self.buildLastLocationKey(currentLocation), JSON.stringify(currentLocation), function(err) {
                if (lastLocation) self.output(lastLocation);
    			done();
            });
        });

    }
});