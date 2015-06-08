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
    id: 'tileLabeler',
    node: 'tileLabeler',
    input: 'locations',
    output: 'tileLabels'
}, {
    id: 'print',
    node: 'print',
    input: 'tileLabels'
}], function(){
    topo.start({
        purge: true
    });
});

process.on('SIGINT', function() {
    topo.destroy(function(){
        console.log('Finished.');
    });
});