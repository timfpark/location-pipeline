var straw = require('straw');

module.exports = straw.node({
    process: function(msg, done) {
        console.log(JSON.stringify(msg));
        done(false);
    }
});