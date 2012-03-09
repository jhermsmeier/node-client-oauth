
var OAuth = require( '../' );

var example = new OAuth.Client({
  version: 1,
  consumer: {
    key: 'key',
    secret: 'secret'
  },
  options: {
    tokenUrl: 'http://term.ie/oauth/example/request_token.php',
    accessUrl: 'http://term.ie/oauth/example/access_token.php',
    // authorizeUrl: '',
    // authenticateUrl: '',
  }
});

example.getRequestToken(function( error, token, response ) {
  
  console.log( token );
  
  example.getAccessToken(function( error, token, response ) {
    
    console.log( token );
    
    example.get(
      'http://term.ie/oauth/example/echo_api.php',
      { message: 'test' },
      function() {
        console.log( arguments[1] );
      }
    );
    
  });
  
});
