var straw = require('straw');
var topo = straw.create();

var opts = {
    nodes_dir: __dirname + '/nodes',
    redis: {
        host: '127.0.0.1',
        port: 6379,
        prefix: 'straw-example'
    }
};

var topo = straw.create(opts);
topo.add([{
    id: 'localSource',
	node: 'localSource',
	output:'locations'
}, {
    id: 'locationDuration',
    node: 'locationDuration',
    input: 'locations',
    output: 'locationDuration'
}, {
    id: 'tileLabeler',
    node: 'tileLabeler',
    input: 'locationDuration',
    output: 'tileLabels'
}, {
    id: 'tileTotalDuration',
    node: 'tileTotalDuration',
    input: 'tileLabels',
    output: 'tileTotalDuration'
}, {
    id: 'print',
    node: 'print',
    input: 'tileTotalDuration'
}], function(){
    topo.start({
    });
});

process.on('SIGINT', function() {
    topo.destroy(function(){
        console.log('Finished.');
    });
});