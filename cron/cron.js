/// WARNING: THIS IS A LIVE CRON FILE! IT *WILL* BE CALLED EVERY MINUTE ///

var paths = {};
var runApp = function (argument) {
  var fs   = require('fs');
  var path = require('path');
  var exec = require('child_process').exec;

  paths.cron = path.join(__dirname, '/cron.js');
  paths.app  = path.join(__dirname, '../app.js');
  var command = "ps ax | grep '" + paths.node + " " + paths.app + "'";

  exec(command, function (err, stdout, stderr) {
    var cronApp = paths.node + " " + paths.app;
    var cronRegexp = new RegExp(cronApp, 'g');
    var matches = stdout.match(cronRegexp);
    if (matches.length === 2) { // When there are only two matches, it just means only the exec process from this PID is running. Thus, init the tor app
      var initApp = paths.node + " " + paths.app + " init";
      exec(initApp, function (err, stdout, stderr) {
        if (err) console.log(err);
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
      });
    } else {
      process.exit(0);
    }
  });
}

///////////////// CRON STOPPER //////////////
var RUN_CRON_ON_DEVELOPMENT = 0;
var RUN_CRON_ON_PRODUCTION  = 1;

if (process.argv[2] === '--run-as-test') RUN_CRON_ON_DEVELOPMENT = 1;

if (process.env.NODE_ENV === 'development') {
  if (RUN_CRON_ON_DEVELOPMENT === 1) {
    paths.node = '/usr/local/bin/node';
    runApp();
  } else {
    process.exit(0);
  }
} else if (process.env.NODE_ENV === 'production')  { // production
  if (RUN_CRON_ON_PRODUCTION === 1) {
    paths.node = '/usr/bin/node';
    runApp();
  } else {
    process.exit(0);
  }
} else {
  process.exit(0);
}
//////////// END OF CRON STOPPER ////////////




