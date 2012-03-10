
'use strict';

var url    = require( 'url' );
var query  = require( 'querystring' );
var https  = require( 'https' );
var crypto = require( 'crypto' );

var OAuth = {
  util: require( '../../util' )
};

var Client = function( options ) {
  
  // Prototype shortcut reference
  var $ = Client.prototype;
  
  /*
   * OAuth protocol version
   */
  $.version = 2.0;
  
  /*
   * Default options
   */
  var defaults = {
    
  };
  
  /*
   * Constructs a new Client object from
   * given credentials.
   * 
   * @api public
   * @param {Object} consumer
   * @param {Object} token
   * @return {Object}
   */
  function Client() {
    
    if( !(this instanceof Client) )
      return new Client();
    
  }
  
  return Client;
  
};

module.exports = Client;
