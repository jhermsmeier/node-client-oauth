
var url    = require( 'url' )
var query  = require( 'querystring' )
var http   = require( 'http' )
var https  = require( 'https' )
var crypto = require( 'crypto' )

var OAuth = {
  util: require( '../../util' )
}

/*
 * Default options
 */
var defaults = {
  // API Base URL
  base: '',
  // OAuth signature method
  signature_method: 'HMAC-SHA1',
  // HTTP request headers
  headers: {
    'Accept': '*/*',
    'Connection': 'Close',
    'User-Agent': 'node.js/oauth'
  }
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
function Client( consumer, token ) {
  
  if( !(this instanceof Client) ) {
    return new Client( consumer, token )
  }
  
  if( !consumer.key || !consumer.secret ) {
    throw new Error( 'Consumer credentials required.' )
  }
  
  if( options != null ) {
    delete options.version
  }
  
  this.consumer = consumer
  this.token    = token || {}
  this.options  = OAuth.util.extend(
    true,
    defaults,
    options
  )
  
}

/**
 * Client prototype.
 * @type {Object}
 */
Client.prototype = {
  
  /**
   * OAuth protocol version.
   * @type {Number}
   */
  version: 1.0,
  
  /*
   * Performs a HTTP request against `resource`
   * with given `method` and `params`. On completion or
   * error `callback` is called with `error`, `data` and `response`.
   * 
   * @api public
   * @param {String} method
   * @param {String} resource
   * @param {Object} params
   * @param {Function} callback
   */
  request: function( method, resource, params, callback ) {
    
    method = method.toUpperCase()
    
    resource = this.options.base + resource
    resource = url.parse( resource )
    
    params = this.prepareParams( method, resource, params )
    params = query.stringify( params )
    
    var ssl = resource.protocol === 'https:'
    var layer = ssl ? https : http
    var body = ''
    
    if( method !== 'POST' && method !== 'PUT' ) {
      resource.path += '?' + params
    } else {
      body = params
    }
    
    var request = layer.request( resource, function( response ) {
      
      var data = ''
      var done = false
      
      response.setEncoding( 'utf8' )
      
      response.on( 'data', function( chunk ) {
        data += chunk
      })
      
      response.on( 'end', function() {
        done = true
        callback( null, data, response )
      })
      
      response.on( 'close', function( error ) {
        if( !done ) {
          callback( error, data, response )
        }
      })
      
    });
    
    request.on( 'error', function( error ) {
      callback( error, null, null )
    })
    
    request.end( body, 'utf8' )
    
  },
  
  /*
   * Same as `OAuthClient.request()`, but with 'GET'
   * as preset `method`
   * 
   * @api public
   * @param {String} resource
   * @param {Object} params
   * @param {Function} callback
   */
  get: function( resource, params, callback ) {
    this.request( 'GET', resource, params, callback )
  },
  
  /*
   * Same as `OAuthClient.request()`, but with 'POST'
   * as preset `method`
   * 
   * @api public
   * @param {String} resource
   * @param {Object} params
   * @param {Function} callback
   */
  post: function( resource, params, callback ) {
    this.request( 'POST', resource, params, callback )
  },
  
  /*
   * Same as `OAuthClient.request()`, but with 'PUT'
   * as preset `method`
   * 
   * @api public
   * @param {String} resource
   * @param {Object} params
   * @param {Function} callback
   */
  put: function( resource, params, callback ) {
    this.request( 'PUT', resource, params, callback )
  },
  
  /*
   * Same as `OAuthClient.request()`, but with 'DELETE'
   * as preset `method`
   * 
   * @api public
   * @param {String} resource
   * @param {Object} params
   * @param {Function} callback
   */
  'delete': function( resource, params, callback ) {
    this.request( 'DELETE', resource, params, callback )
  },
  
  /*
   * Prepares given `params` (Adds standard OAuth parameters,
   * sorts them and finally adds the signature).
   * 
   * @api public
   * @param {String} method
   * @param {String|Object} resource
   * @param {Object} params
   */
  prepareParams: function( method, resource, params ) {
    
    params = OAuth.util.extend({
      'oauth_timestamp':        OAuth.util.getTime(),
      'oauth_version':          this.version,
      'oauth_nonce':            OAuth.util.getNonce(),
      'oauth_signature_method': this.options.signature_method,
      'oauth_consumer_key':     this.consumer.key
    }, params )
    
    if( this.token.key ) {
      params['oauth_token'] = this.token.key
    }
    
    // Sort parameters alphabetically
    var keys = Object.keys( params ).sort()
    var i, key, swap = params, params = {}
    
    for( i in keys ) {
      key = keys[i]
      params[ key ] = swap[ key ]
    }
    
    params['oauth_signature'] = this.sign( method, resource, params )
    
    return params
    
  },
  
  /*
   * Creates the OAuth signature from
   * `method`, `resource` and `params`.
   * 
   * @api public
   * @param {String} method
   * @param {String|Object} resource
   * @param {Object} params
   */
  sign: function( method, resource, params ) {
    
    resource = url.parse( resource )
    resource = resource.protocol + '//'
             + resource.host
             + resource.path
    resource = OAuth.util.encodeComponent( resource )
    
    // Remove `oauth_signature` if present
    // ref: spec: 9.1.1 ("the oauth_signature parameter MUST be excluded.")
    if( params.oauth_signature ) {
      delete params.oauth_signature
    }
    
    params = query.stringify( params )
    params = OAuth.util.encodeComponent( params )
    
    var base = [ method, resource, params ].join( '&' )
    var key  = [ this.consumer.secret, this.token.secret ].join( '&' )
    var hash = ''
    
    switch( this.options.signature_method ) {
      case 'HMAC-SHA1':
        hash = crypto.createHmac( 'sha1', key )
                     .update( base )
                     .digest( 'base64' )
        break;
      case 'PLAINTEXT':
        hash = OAuth.util.encodeComponent( key )
        break;
      default:
        throw new Error( 'Signature method not implemented.' )
        break;
    }
    
    return hash
    
  }
  
}

module.exports = Clien
