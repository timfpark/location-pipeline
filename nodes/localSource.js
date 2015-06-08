var fs = require('fs')
  , byline = require('byline')
  , rs = process.stdin
  , straw = require('straw');

module.exports = straw.node({
    timer: null,
    opts: {
        interval: 1
    },

    initialize: function(opts, done) {
        this.opts.interval = opts && opts.interval || 1000;
        done();
    },

    start: function(done) {
        var self = this;

        var stream = byline(fs.createReadStream('location.csv', { encoding: 'utf8' }))

        stream.on('data', function(line) {
            var fields = line.split(',');

            var ts = parseFloat(fields[0]);
            var latitude = parseFloat(fields[1]);
            var longitude = parseFloat(fields[2]);

            self.output({
                'ts': ts,
                'latitude': latitude,
                'longitude': longitude
            });
        });

        done();
    },

    stop: function(done) {
        done(false);
    }
});
