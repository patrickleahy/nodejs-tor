var config   = require('../../config')
  , zmq      = require('zmq')
  , upstream = zmq.socket('push')
  , utils    = require(config.rootPath + "/utils")
  , backwashServer = zmq.socket('rep');
/////////// UPSTREAM ///////////
// Note. This must be called seperately:
// $ node app.js init 

var NUMBER_OF_REQUESTS = 10;

var generateRequests = function (size) {
  var requests = [];

  for (var i = 0; i < size; i++) {
    var id = i + 1;
    var request = {"id": utils.createApiCompliantId('recon', 'lists', id), "url": "http://www.google.com/", "bucket": "recontests", "filename": id + ".html.gz"};
    requests.push(request);
  }
  return requests;
}

////////// UPSTREAM PIPELINE //////////
upstream.identity = 'upstream' + process.pid;
upstream.bind(config.topology.upstream, function(err) {
  if (err) throw err;
  console.log('Upstream successfully bound to ' + config.topology.upstream);

  var requests = generateRequests(NUMBER_OF_REQUESTS);
  for (var i = 0; i < requests.length; i++) {
    console.log("Sending request id = " + requests[i].id + " url = " + requests[i].url);
    var message = JSON.stringify(requests[i]);

    setTimeout(function (myMessage) {
      upstream.send(myMessage);
    }, 30, message);
  }

  ////////// BACKWASH SERVER //////////
  
  backwashServer.identity = 'backwashServer' + process.pid;
  backwashServer.bind(config.topology.backwash, function(err) {
    if (err) throw err;
    console.log('backwashServer bound!');

    backwashServer.on('message', function(data) {
      var response = JSON.stringify({statusCode: 200});
      backwashServer.send(response);
      
      var backwashedMessage = data.toString();
      upstream.send(backwashedMessage);
      console.log(backwashedMessage);
    });
  });
});

process.on('SIGINT', function() {
  upstream.close();
  backwashServer.close();
});