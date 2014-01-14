var utils = require('../utils');
var app   = require('../app');
var assert = require('assert');

var compliantRequest    = {"id": utils.createApiCompliantId('recon', 'lists', 1), 'ingress_coupling_id': 4, 'egress_coupling_id': 5, "url": "http://www.google.com", "bucket": "recontests", "filename": "1.html.gz"};
var uncompliantRequests = [
    {}
  , {"id": utils.createApiCompliantId('recon', 'lists', 1)}
  , {"id": "abc", "url": "http://www.google.com", "bucket": "recontests", "filename": "1.html.gz"}
  , {"id": "ab1", "url": "http://www.google.com", "bucket": "recontests", "filename": "1.html.gz"}
  , {"id": "ab-1", "url": "http://www.google.com", "bucket": "recontests", "filename": "1.html.gz"}
  , {"id": "ab-1", "url": "http://www.google.com", "bucket": "recontests", "filename": "1.html.gz", "filename1": "1.html.gz"}
]

assert.equal(true, utils.upsteamApiCompliant(compliantRequest), "Compliant request failed");

for (var i = 0; i < uncompliantRequests.length; i++) {
  assert.equal(false, utils.upsteamApiCompliant(uncompliantRequests[i]), "Uncompliant request #" + i + " worked when it should have failed");
}

console.log("All assertions passed. upsteamApiCompliant is working properly");
