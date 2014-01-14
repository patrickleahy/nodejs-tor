
////////////////////////////////////
/// ZEROMQ NETWORK TOPOLOGY FILE ///
////////////////////////////////////

exports.development = {
    upstream      : 'tcp://127.0.0.1:12345'
  , downstream    : 'tcp://127.0.0.1:12346'
  , workServer    : 'tcp://127.0.0.1:12347'
  , pipelineServer: 'tcp://127.0.0.1:12348'
  , overlord      : 'ipc://tmp/overlord/0'
  , dashboard     : 'tcp://127.0.0.1:12330'
}

exports.production = {
    upstream      : 'tcp://127.0.0.1:12345'
  , downstream    : 'tcp://127.0.0.1:12346'
  , workServer    : 'tcp://127.0.0.1:12347'
  , pipelineServer: 'tcp://127.0.0.1:12348'
  , overlord      : 'ipc://tmp/overlord/0'
  , dashboard     : 'tcp://127.0.0.1:12330'
}