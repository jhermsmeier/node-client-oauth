
'use strict';

var url    = require( 'url' );
var query  = require( 'querystring' );
var http   = require( 'http' );
var https  = require( 'https' );
var crypto = require( 'crypto' );
var util   = require( 'util' );
var events = require( 'events' );

var OAuth = {
  util: require( './util' )
};

var OAuthClient = (function() {
  
  var $;
  
  // Default options
  var defaults = {
    // The OAuth protocol version
    version: 1,
    // Consumer credentials
    consumer: {},
    // Consumer access tokens
    token: {},
    // Request options
    options: {
      // Request token URL
      tokenUrl: '',
      // Access token URL
      accessUrl: '',
      // Authorization URL
      // authorizeUrl: '',
      // Authentication URL
      // authenticateUrl: '',
      // OAuth signature method
      signatureMethod: 'HMAC-SHA1',
      // HTTP headers
      headers: {
        'Accept': '*/*',
        'Connection': 'Close',
        'User-Agent': 'node.js ' + process.versions.node
      }
    }
  };
  
  // Constructor
  function OAuthClient( options ) {
    
    // Sanity check / shortcut
    if( !(this instanceof OAuthClient) )
      return new OAuthClient( options );
    
    // Call parent constructor
    events.EventEmitter.call( this );
    
    // configure
    OAuth.util.extend(
      true, this, defaults, options
    );
    
  }
  
  // Inherit EventEmitter
  util.inherits( OAuthClient, events.EventEmitter );
  
  // Prototype shortcut reference
  $ = OAuthClient.prototype;
  
  $.getNonce = function() {
    
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        nonce = '';
    
    for( var i = 32, c = chars.length; i < c; i++ )
      nonce += chars[ ( Math.random() * c ) | 0 ];
    
    return nonce;
    
  };
  
  $.getTime = function() {
    return ( new Date().getTime() / 1000 ) | 0;
  };
  
  $.getRequestToken = function( callback ) {
    this.getToken( this.options.tokenUrl, callback );
  };
  
  $.getAccessToken = function( callback ) {
    this.getToken( this.options.accessUrl, callback );
  };
  
  $.getToken = function( resource, callback ) {
    
    var self = this;
    
    this.get(
      resource, {},
      function( error, data, response ) {
        
        if( response.statusCode === 200 ) {
          data = query.parse( data );
          self.token = {
            key: data.oauth_token,
            secret: data.oauth_token_secret
          };
          // self.emit( 'token:request', self.token );
        }
        
        if( callback )
          callback( error, self.token, response );
        
      }
    );
    
  };
  
  $.request = function( method, resource, params, callback ) {
    
    method = method.toUpperCase();
    
    params = this.prepareParams( method, resource, params );
    params = query.stringify( params );
    
    // Make request
    // var request = http.request( options, callback );
    
    var ssl = resource.protocol === 'https:'
    var layer = ssl ? https : http;
    var options = url.parse( resource );
    
    var body = '';
    
    if( method === 'POST' || method === 'PUT' )
      body = params;
    else
      options.path += '?' + params;
    
    var request = layer.request( options, function( response ) {
      
      var data = null;
      
      response.setEncoding( 'utf8' );
      response.on( 'data', function( chunk ) {
        if( data !== null ) data += chunk;
        else data = chunk;
      });
      response.on( 'end', function() {
        callback( null, data, response );
      });
      response.on( 'close', function( error ) {
        if( error ) throw error;
      });
      
    });
    
    request.on( 'error', function( error ) {
      // throw error;
      callback( error, null, null );
    });
    
    request.end( body, 'utf8' );
    
  };
  
  $.get = function( resource, params, callback ) {
    this.request( 'GET', resource, params, callback );
  };
  
  $.post = function( resource, params, callback ) {
    this.request( 'POST', resource, params, callback );
  };
  
  $.put = function( resource, params, callback ) {
    this.request( 'PUT', resource, params, callback );
  };
  
  $.delete = function( resource, params, callback ) {
    this.request( 'DELETE', resource, params, callback );
  };
  
  $.prepareParams = function( method, resource, params ) {
    
    params = OAuth.util.extend({
      'oauth_timestamp':        this.getTime(),
      'oauth_version':          this.version,
      'oauth_nonce':            this.getNonce(),
      'oauth_signature_method': this.options.signatureMethod,
      'oauth_consumer_key':     this.consumer.key
    }, params );
    
    if( this.token.key )
      params['oauth_token'] = this.token.key;
    
    // Sort parameters alphabetically
    var keys = Object.keys( params ).sort();
    var i, key, swap = params, params = {};
    
    for( i in keys ) {
      key = keys[i];
      params[ key ] = swap[ key ];
    }
    
    params['oauth_signature'] = this.sign( method, resource, params );
    
    return params;
    
  };
  
  $.sign = function( method, resource, params ) {
    
    resource = url.parse( resource );
    resource = resource.protocol + '//'
             + resource.host
             + resource.path;
    resource = OAuth.util.encodeComponent( resource )
    
    // Remove `oauth_signature` if present
    // ref: spec: 9.1.1 ("the oauth_signature parameter MUST be excluded.")
    if( params.oauth_signature )
      delete params.oauth_signature;
    
    params = query.stringify( params );
    params = OAuth.util.encodeComponent( params );
    
    var base = [ method, resource, params ].join( '&' );
    var key  = [ this.consumer.secret, this.token.secret ].join( '&' );
    var hash = '';
    
    switch( this.options.signatureMethod ) {
      case 'HMAC-SHA1':
        hash = crypto.createHmac( 'sha1', key ).update( base ).digest( 'base64' );
        break;
      case 'PLAINTEXT':
        hash = OAuth.util.encodeComponent( key )
        break;
      default:
        throw new Error( 'Signature method not implemented.' );
        break;
    }
    
    return hash;
    
  };
  
  return OAuthClient;
  
})();

module.exports = OAuthClient;
