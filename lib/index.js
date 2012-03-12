
'use strict';

var OAuth = {
  1.0: require( './oauth/1.0' ),
  // 2.0: require( './oauth/2.0' )
};

var API = (function() {
  
  // Prototype shortcut reference
  var $ = API.prototype;
  
  /*
   * Constructs a new OAuth API
   * from given arguments.
   * 
   * @param {Object|String} options
   * @param {Number} version
   * @return {Object}
   */
  function API( options, version ) {
    
    if( !(this instanceof API) )
      return new API( options, version );
    
    if( typeof options === 'string' )
      options = { base: options };
    else if( typeof options === 'number' ) {
      version = options;
      options = {};
    }
    
    if( !(this.Client = OAuth[ options.version || version || 2 ]) )
      throw new Error( 'OAuth version not implemented.' );
    
    this.Client = this.Client( options );
    
  }
  
  return API;
  
})();

module.exports = API;
