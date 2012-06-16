
var OAuth = {
  1.0: require( './api/1.0' ),
  // 2.0: require( './api/2.0' ),
}

module.exports = function( version ) {
  
  version = parseFloat( version )
  
  if( !OAuth.hasOwnProperty( version ) ) {
    throw new Error( 'OAuth version not implemented.' )
  }
  
  return OAuth[ version ]
  
}
