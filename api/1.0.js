
var query  = require( 'querystring' )
var http   = require( 'http' )
var https  = require( 'https' )
var crypto = require( 'crypto' )
var URL    = require( 'url' )

var OAuth = {
  util: require( './util' )
}

function Consumer( options ) {
  
  if( !(this instanceof Consumer) ) {
    return new Consumer( options )
  }
  
  this.configure( options )
  
  this.Client = Consumer.Client( this )
  
}

Consumer.Client = require( './1.0-client' )

Consumer.defaults = {
  base: '',
  key: '',
  secret: '',
  signature_method: 'HMAC-SHA1',
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
  version: 1.0,
  
  /*
   * Performs a HTTP request against `url`
   * with given `method` and `data`. On completion or
   * error `callback` is called with `error`, `data` and `response`.
   * 
   * @api public
   * @param {Object} client
   * @param {String} method
   * @param {String} url
   * @param {Object} data
   * @param {Function} callback
   */
  request: function( client, method, url, data, callback ) {
    
    method   = ( method + '' ).toUpperCase()
    url      = URL.parse( this.base + url )
    callback = callback || function() {}
    data     = query.stringify(
      this.prepareParams( client, method, url, data )
    )
    
    var body  = ''
    var layer = url.protocol === 'https:'
      ? https
      : http
    
    if( method !== 'POST' && method !== 'PUT' ) {
      url.path += '?' + data
    } else {
      body = data
    }
    
    url.method  = method
    url.headers = this.headers
    
    var request = layer.request( url, function( response ) {
      
      var buffer = ''
      var done = false
      
      response.setEncoding( 'utf8' )
      
      response.on( 'data', function( chunk ) {
        buffer += chunk
      })
      
      response.on( 'end', function() {
        done = true
        callback( null, buffer, response )
      })
      
      response.on( 'close', function() {
        if( !done ) { callback( error, buffer, response ) }
      })
      
    })
    
    request.on( 'error', function( error ) {
      callback( error )
    })
    
    request.end( body, 'utf8' )
    
  },
  
  /*
   * Prepares given `data` (Adds standard OAuth parameters,
   * sorts them and finally adds the signature).
   * 
   * @api public
   * @param {Object} client
   * @param {String} method
   * @param {String|Object} url
   * @param {Object} data
   */
  prepareParams: function( client, method, url, data ) {
    
    data = data || Object.create( null )
    
    var defaults = {
      'oauth_timestamp':        OAuth.util.getTime(),
      'oauth_version':          this.version,
      'oauth_token':            client.key,
      'oauth_nonce':            OAuth.util.getNonce(),
      'oauth_signature_method': this.signature_method,
      'oauth_consumer_key':     this.key
    }
    
    for( var i in defaults ) {
      if( defaults.hasOwnProperty(i) ) {
        data[i] = defaults[i]
      }
    }
    
    var keys = Object.keys( data ).sort()
    var key, params = {}
    
    for( var k in keys ) {
      key = keys[k]
      params[ key ] = data[ key ]
    }
    
    params['oauth_signature'] = this.sign( client, method, url, params )
    
    return params
    
  },
  
  /*
   * Creates the OAuth signature from
   * `method`, `url` and `data`.
   * 
   * @api public
   * @param {Object} client
   * @param {String} method
   * @param {String|Object} url
   * @param {Object} data
   */
  sign: function( client, method, url, data ) {
    
    url = URL.parse( url )
    url = url.protocol + '//'
        + url.host
        + url.path
    url = OAuth.util.encodeComponent( url )
    
    // Remove `oauth_signature` if present
    // ref: spec: 9.1.1 ("the oauth_signature parameter MUST be excluded.")
    if( data.oauth_signature ) {
      delete data.oauth_signature
    }
    
    data = query.stringify( data )
    data = OAuth.util.encodeComponent( data )
    
    var base = [ method, url, data ].join( '&' )
    var key  = [ this.secret, client.secret ].join( '&' )
    var hash = ''
    
    switch( this.signature_method ) {
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
    
  },
  
  configure: function( options ) {
    
    var defaults = this.options || Consumer.defaults
    
    for( var i in defaults ) {
      if( defaults.hasOwnProperty( i ) ) {
        this[i] = options[i] || defaults[i]
      }
    }
    
    this.signature_method = this.signature_method.toUpperCase()
    
  }
  
}

module.exports = Consumer
