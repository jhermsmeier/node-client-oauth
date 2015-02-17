var OAuth = require( '../../' )
var assert = require( 'assert' )

describe( 'PLAINTEXT', function() {
  
  var ExampleAPI = null
  var client = null
  
  it( 'Creating an API Endpoint', function() {
    ExampleAPI = new OAuth[1.0]({
      baseUrl: 'http://term.ie/oauth/example/',
      key: 'key',
      secret: 'secret',
      signatureMethod: 'PLAINTEXT',
    })
  })
  
  it( 'Creating a Client', function() {
    client = new ExampleAPI.Client()
  })
  
  it( 'Getting a Request Token', function( next ) {
    
    var requestTokenUrl = 'request_token.php'
    var expectedData = 'oauth_token=requestkey&oauth_token_secret=requestsecret'
    
    client.get( requestTokenUrl, null, function( error, data, response ) {
      assert.ifError( error )
      assert.equal( response.statusCode, 200 )
      assert.equal( data, expectedData )
      next()
    })
    
  })
  
  it( 'Getting an Access Token', function( next ) {
    
    var accessTokenUrl = 'access_token.php'
    var expectedData = 'oauth_token=accesskey&oauth_token_secret=accesssecret'
    
    client.get( accessTokenUrl, null, function( error, data, response ) {
      assert.ifError( error )
      assert.equal( response.statusCode, 200 )
      assert.equal( data, expectedData )
      next()
    })
    
  })
  
  it( 'Making Authenticated Calls', function( next ) {
    
    var echoUrl = 'echo_api.php'
    var expectedData = 'pleasesaysomethingbacktome'
    
    client.get( echoUrl, null, function( error, data, response ) {
      assert.ifError( error )
      assert.equal( response.statusCode, 200 )
      assert.equal( data, expectedData )
      next()
    })
    
  })
  
})
