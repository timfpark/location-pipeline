var fs = require('fs')
  , lineReader = require('line-reader')
  , straw = require('straw');

module.exports = straw.node({
    timer: null,
    currentIndex: 0,
    lines: [],
    opts: {
        interval: 1
    },

    initialize: function(opts, done) {
        this.opts.interval = opts && opts.interval || 1000;
        done();
    },

    sendLocation: function() {
        if (this.currentIndex >= this.lines.length) return;

        var line = this.lines[this.currentIndex++];
        var fields = line.split(',');

        var ts = parseFloat(fields[0]);
        var latitude = parseFloat(fields[1]);
        var longitude = parseFloat(fields[2]);

        this.output({
            'ts': ts,
            'latitude': latitude,
            'longitude': longitude
        });
    },

    start: function(done) {
        var fileContents = fs.readFileSync('location.csv', 'utf8');

        this.lines = fileContents.split('\r');
        console.log('lines: ' + this.lines.length);

        this.timer = setInterval(this.sendLocation.bind(this), 1);

        done();
    },

    stop: function(done) {
        done(false);
    }
});
