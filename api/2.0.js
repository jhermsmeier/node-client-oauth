
var url    = require( 'url' )
var query  = require( 'querystring' )
var https  = require( 'https' )
var crypto = require( 'crypto' )

var OAuth = {
  util: require( './util' )
}

function Consumer( options ) {
  
  if( !(this instanceof Consumer) ) {
    return new Consumer( options )
  }
  
  this.configure( options )
  
}

Consumer.defaults = {
  id: '',
  secret: '',
  token_name: 'oauth_token',
  headers: {
    'Accept': '*/*',
    'Connection': 'Close',
    'User-Agent': 'node.js/client-oauth'
  }
}

Consumer.prototype = {
  
  /**
   * OAuth protocol version.
   * @type {Number}
   */
  version: 2.0,
  
}

module.exports = Consumer
