var straw = require('straw');

module.exports = straw.node({
    initialize: function(opts, done) {
        this.opts = opts;
        done();
    },

    buildLastLocationKey: function(location) {
        return "lastLocation." + location.principalId;
    },

    process: function(currentLocation, done) {
        var self = this;

        this.opts.redis.client.get(this.buildLastLocationKey(currentLocation), function(err, lastLocation) {
            if (err) return done(new Error(err));

            if (lastLocation) {
                lastLocation = JSON.parse(lastLocation);
                lastLocation.duration = (currentLocation.ts - lastLocation.ts) / 1000.0;

                // if we have out of order messages don't emit negative duration.
                if (lastLocation.duration < 0) lastLocation = null;
            }

            self.opts.redis.client.set(self.buildLastLocationKey(currentLocation), JSON.stringify(currentLocation), function(err) {
                if (err) return done(new Error(err));

                if (lastLocation)
                    self.output(lastLocation, done);
                else
                    done();
            });
        });
    }
});