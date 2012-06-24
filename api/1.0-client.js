
module.exports = function( consumer ) {
  
  /**
   * Client constructor.
   * @param {String} key 
   * @param {String} secret 
   */
  function Client( key, secret ) {
    
    if( !(this instanceof Client) ) {
      return new Client( key, secret )
    }
    
    this.key    = key || ''
    this.secret = secret || ''
    
  }
  
  /**
   * Client prototype.
   * @type {Object}
   */
  Client.prototype = {
    
    request: function( method, url, data, callback ) {
      consumer.request( this, method, url, data, callback )
    },
    
    get: function( url, data, callback ) {
      consumer.request( this, 'GET', url, data, callback )
    },
    
    post: function( url, data, callback ) {
      consumer.request( this, 'POST', url, data, callback )
    },
    
    put: function( url, data, callback ) {
      consumer.request( this, 'PUT', url, data, callback )
    },
    
    'delete': function( url, data, callback ) {
      consumer.request( this, 'DELETE', url, data, callback )
    },
    
  }
  
  return Client
  
}
