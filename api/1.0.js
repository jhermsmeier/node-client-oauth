
var query  = require( 'querystring' )
var http   = require( 'http' )
var https  = require( 'https' )
var crypto = require( 'crypto' )
var URL    = require( 'url' )

var OAuth = require( './util' )

/**
 * Consumer constructor
 * @param {Object} options
 */
function Consumer( options ) {
  
  if( !(this instanceof Consumer) )
    return new Consumer( options )
  
  for( var k in Consumer.defaults ) {
    this[k] = options[k] || Consumer.defaults[k]
  }
  
}

/**
 * Consumer client (user)
 * @type {Function}
 */
Consumer.Client = require( './1.0-client' )

/**
 * Consumer default options
 * @type {Object}
 */
Consumer.defaults = {
  baseURL: '',
  key: '',
  secret: '',
  signature_method: 'HMAC-SHA1',
  headers: {
    'Accept':     '*/*',
    'Connection': 'Close',
    'User-Agent': 'npmjs.org/client-oauth',
  }
}

/**
 * Consumer prototype
 * @type {Object}
 */
Consumer.prototype = {
  
  /**
   * OAuth protocol version.
   * @type {String} Some clients require the 1.0 to be fully written
   * out and if it is a number, it gets passed as 1
   */
  version: '1.0',
  
  /**
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
    
    method   = method.toUpperCase()
    url      = URL.parse( this.baseURL + url )
    callback = callback || function() {}
    data     = query.stringify( data )
    protocol = url.protocol === 'https:'
      ? https : http
    
    if( method !== 'POST' && method !== 'PUT' ) {
      if( data && data.length > 0 ) {
        url.path += '?' + data
        data = null
      }
    }
    
    url.method = method
    url.headers = {
      'Authorization': this.auth( client, method, url )
    }
    
    for( var k in this.headers ) {
      url.headers[k] = this.headers[k]
    }
    
    var request = protocol.request( url, function( response ) {
      
      var buffer = ''
      var done = false
      
      response.setEncoding( 'utf8' )
      response
        .on( 'data', function( chunk ) {
          buffer += chunk
        })
        .on( 'close', function() {
          if( !done ) callback( true, buffer, response )
        })
        .on( 'end', function() {
          done = true
          callback( null, buffer, response )
        })
      
    })
    
    request
      .on( 'error', function( error ) {
        callback( error )
      })
      .end( data, 'utf8' )
    
  },
  
  /**
   * Creates the OAuth authorization header
   * @param  {Object} client
   * @param  {String} method
   * @param  {String} url
   * @return {String}
   */
  auth: function( client, method, url ) {
    
    var header = 'OAuth '
    var params = [
      [ 'oauth_consumer_key',     this.key ],
      [ 'oauth_nonce',            OAuth.generateNonce() ],
      [ 'oauth_signature_method', this.signature_method ],
      [ 'oauth_timestamp',        OAuth.getTime() ],
      [ 'oauth_token',            client.key ],
      [ 'oauth_version',          this.version ],
    ]
    
    params.push( this.sign( client, method, url, params ) )
    params.sort( function( a, b ) {
      return a[0].localeCompare( b[0] )
    })
    
    return header + params.join( ', ' )
  },
  
  /**
   * Creates the OAuth signature
   * @param  {Object} client
   * @param  {String} method
   * @param  {String} url
   * @param  {Array}  params
   * @return {Array}
   */
  sign: function( client, method, url, params ) {
    
    var hash, key, base = {}
    
    url = URL.parse( url )
    url = [ url.protocol, '//', url.host, url.path ].join( '' )
    url = OAuth.encodeComponent( url )
    
    params.sort( function( a, b ) {
      return a[0].localeCompare( b[0] )
    })
    
    for( var k in params ) {
      base[ params[k][0] ] = params[k][1]
    }
    
    base = query.stringify( base )
    base = OAuth.encodeComponent( base )
    
    base = [ method, url, base ].join( '&' )
    key  = [ this.secret, client.secret ].join( '&' )
    
    switch( this.signature_method ) {
      case 'HMAC-SHA1':
        hash = crypto.createHmac( 'sha1', key )
        hash = hash.update( base )
        hash = hash.digest( 'base64' )
        break
      case 'PLAINTEXT':
        hash = OAuth.encodeComponent( key )
        break
      default:
        throw new Error( 'Signature method not implemented.' )
        break
    }
    
    return [ 'oauth_signature', hash ]
    
  }
  
}

module.exports = Consumer
