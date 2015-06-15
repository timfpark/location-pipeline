var fs = require('fs')
  , byline = require('byline')
  , rs = process.stdin
  , straw = require('straw');

module.exports = straw.node({
    start: function(done) {
        var self = this;

        this.opts.redis.client.flushdb(function(err) {
            if (err) return done(err);

            var stream = byline(fs.createReadStream('location.csv', { encoding: 'utf8' }))

            stream.on('data', function(line) {
                var fields = line.split(',');

                var location = {
                    principalId: '1',
                    ts: parseFloat(fields[0]),
                    latitude: parseFloat(fields[1]),
                    longitude: parseFloat(fields[2])
                };

                self.output(location);
            });

            done();
        });
    },

    stop: function(done) {
        done(false);
    }
});
