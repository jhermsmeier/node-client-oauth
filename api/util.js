
module.exports = {
  
  /*
   * Generates a nonce with given `length`
   * @param {Number} length
   * @return {String} nonce
   */
  getNonce: function( length ) {
    
    length = length || 32
    
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var nonce = ''
    
    for( var i = 0; i < length; i++ ) {
      nonce += chars[ ( Math.random() * length ) | 0 ]
    }
    
    return nonce
    
  },
  
  /*
   * Retrieves unix time in seconds
   * @return {Number} timestamp
   */
  getTime: function() {
    return ( new Date().getTime() / 1000 ) | 0
  },
    
  /*
   * RFC compliant `encodeURIComponent()`
   * @param {String} input
   * @return {String}
   */
  encodeComponent: function( input ) {
    
    if( input == null || input == '' ) {
      return ''
    }
    
    input = encodeURIComponent( input )
    input = input.replace( /[!'()*]/g, function( char ) {
      return '%' + char.charCodeAt(0).toString(16)
    })
    
    return input
    
  },
  
  /*
   * Enhanced `decodeURIComponent()`
   * @param {String} input
   * @return {String}
   */
  decodeComponent: function( input ) {
    return decodeURIComponent(
      ( input || '' ).replace( /\+/g, ' ' )
    )
  }
  
}
