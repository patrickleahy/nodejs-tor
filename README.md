nodejs-tor
==========

Scale your own cluster of tors for distributed anonymous requests. Build with Node.js and ZeroMQ

This is an early version I pulled out of an application of mine. I plan to refactor the code, clean things up, and make this a stand alone module sometime soon. Please email me at patrick [at] patrickleahy.org if you're interested in helping out!

============WORK API============
~~~~~~~~~~~~REQUEST~~~~~~~~~~~~~
{
    'id'                 : <String> must be unique across entire system (e.g. id + table name)
  , 'ingress_coupling_id': <int> 
  , 'egress_coupling_id' : <int>
  , 'url'                : <String>
  , 'storageOptions'     : <Object>
}

~~~~~~~~~~~~RESPONSE~~~~~~~~~~~~
{
    id                   : <int>
  , 'ingress_coupling_id': <int> 
  , 'egress_coupling_id' : <int>
  , statusCode           : <int>
  , headers              : <String> <JSON>
  , instanceName         : <String> <JSON>
  , socksPort            : <int> (Optional)
}





