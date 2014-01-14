var config     = require('../../config')
  , zmq        = require('zmq')
  , downstream = zmq.socket('pull');

// DOWNSTREAM //
downstream.identity = 'downstream:' + process.pid;
downstream.connect(config.topology.downstream);
console.log('Downstream successfully connected to ' + config.topology.downstream);
downstream.on('message', function(data) {
  var message = JSON.parse(data.toString());
  delete message.headers;
  console.log("Downstream received: " + JSON.stringify(message));
});

process.on('SIGINT', function() {
  downstream.close();
});