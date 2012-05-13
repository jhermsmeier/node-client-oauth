
var url    = require( 'url' )
var query  = require( 'querystring' )
var https  = require( 'https' )
var crypto = require( 'crypto' )

var OAuth = {
  util: require( './util' )
};

module.exports = function( options ) {
  
  // Lifetimes
  var ACCESS_TOKEN_LIFETIME  = 3600
  var AUTH_CODE_LIFETIME     = 30
  var REFRESH_TOKEN_LIFETIME = 1209600

  // Response types (Obtaining End-User Authorization)
  ;[
    'token',
    'code',
    'code-and-token'
  ]

  // Response types (Obtaining an Access Token)
  ;[
    'authorization_code',
    'password',
    'assertion',
    'refresh_token',
    'none'
  ]

  /*
   * Default options
   */
  var defaults = {
    base: '',
    token_name: 'oauth_token'
  }

  /*
   * Constructs a new Client object from
   * given credentials.
   * 
   * @api public
   * @param {Object} consumer
   * @param {Object} token
   * @return {Object}
   */
  function Client( consumer ) {
    
    if( !(this instanceof Client) ) {
      return new Client( consumer )
    }
    
    if( !consumer.id || !consumer.secret ) {
      throw new Error( 'Consumer credentials required.' )
    }
    
    if( options != null ) {
      delete options.version
    }
    
    this.consumer = consumer
    this.options  = OAuth.util.extend(
      true,
      defaults,
      options
    )
    
  }

  Client.prototype = {
    
    /**
     * OAuth protocol version.
     * @type {Number}
     */
    version: 2.0,
    
    
    
  }
  
}