var zmq    = require('zmq');
var config = require('../../config');
var utils = require('../../utils');

///////////////////////////
///// Pipeline Server /////
///////////////////////////

var workCache = new utils.WorkCache();

var pipelineServer = zmq.socket('router');
pipelineServer.identity = 'server' + process.pid;
pipelineServer.bind(config.topology.pipelineServer, function(err) {
  if (err) throw err;
  console.log(pipelineServer.identity + ' bound!');
  
  // Add some work
  var someRandomWorkFromSql = {"id": utils.createApiCompliantId('recon', 'lists', 1), 'ingress_coupling_id': 4, 'egress_coupling_id': 5, "url": "http://www.google.com", "bucket": "recontests", "filename": "1.html.gz"};
  workCache.addWork('todo', someRandomWorkFromSql);

  var message = JSON.stringify({headers: {type: 'broadcast', topic: 'workInPipeline'}, body: null});
  pipelineServer.send(message);
  console.log(pipelineServer.identity + " broadcasted " + message);

  var envelopes = {};
  pipelineServer.on('message', function(envelope, data) {
    var message  = utils.readMessage(data);
    var envelope = envelope.toString();
    if (message.headers.type !== 'ping') console.log(pipelineServer.identity + " received from " + envelope + " message = " + JSON.stringify(message));
    switch (message.headers.type) {
      case 'connect':
        console.log("Connected: " + envelope);
        envelopes[envelope] = Date.now();
        var message = JSON.stringify({headers: {type: 'connected'}, body: null});
        pipelineServer.send([envelope, message]);
        pipelineServer.send([envelope, utils.ping()]);
        break;
      case 'ping':
        envelopes[envelope] = Date.now();
        pipelineServer.send([envelope, utils.ping()]);
        setTimeout(function() {
          if (envelope in envelopes) {
            if (Date.now() - envelopes[envelope] > 5000) {
              delete envelopes[envelope];
              console.log("Worker " + envelope + " has failed silently"); // silent failure
            }
          }
        }, 10000);
        break;
      case 'delete': // noisy failure
        console.log("Worker has failed noisily: " + envelope);
        delete envelopes[envelope];
        break;
      case 'identity':
        if (message.headers.topic === "getWorkFromPipeline") {
          var work = workCache.getAnyWork('todo');
          console.log("work " + JSON.stringify(work));
          if (work !== undefined) {
            workCache.deleteWork('todo', work);
            workCache.addWork('wip', work);

            var reply = JSON.stringify({headers: {type: 'identity', topic: 'workFromPipeline'}, body: work});
            pipelineServer.send([envelope, reply]);
            console.log(pipelineServer.identity + " sent to " + envelope + " message " + reply); // silent failure
          }
        } else if (message.headers.topic === "workForPipelineDone") {
          var work = message.body;
          workCache.deleteWork('wip', work);
          console.log("=> Todo: pipeline database connection here");
        }
    }
  });
});