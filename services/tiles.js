var request = require('request');

var findById = function(tileId, callback) {
    console.log(tileId);
    request('http://localhost:3333/tile/' + tileId, function (err, response, body) {
        return callback(err, JSON.parse(body));
    });
};

module.exports = {
    MAX_ZOOM: 16,

    findById: findById

};
