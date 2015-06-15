var straw = require('straw');

module.exports = straw.node({
    process: function(location, done) {
        console.dir(location);
        done(false);
    }
});