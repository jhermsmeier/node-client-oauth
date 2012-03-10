
var OAuth = require( '../' );

var example = new OAuth.Client({
  version: 1,
  consumer: {
    key: 'key',
    secret: 'secret'
  },
  options: {
    baseUrl: 'http://term.ie/oauth/example',
    tokenUrl: '/request_token.php',
    accessUrl: '/access_token.php',
    // authorizeUrl: '',
    // authenticateUrl: '',
  }
});

example.getRequestToken( null, function( error, token, response ) {
  
  console.log( token );
  
  example.getAccessToken( null, function( error, token, response ) {
    
    console.log( token );
    
    example.get(
      '/echo_api.php',
      { message: 'test' },
      function() {
        console.log( arguments[1] );
      }
    );
    
  });
  
});
