# Node.js OAuth Client Library

## Usage

First of all, you'll need to create an API object
to create clients from that API.

There are two ways to do this.
The first is, specifying everything in an options
object. `new OAuth.API( [options] )`

```javascript
var Example = new OAuth.API({
  version: 1,
  base: 'http://term.ie/oauth/example',
  signature_method: 'PLAINTEXT',
  headers: {
    'Connection': 'Close',
    'User-Agent': 'node.js/oauth'
  }
})
```

The second, and short version is to use the form
`new OAuth.API( [baseUrl], [version] )`:

```javascript
var Example = new OAuth.API( 'http://term.ie/oauth/example', 1 )
```

### OAuth 1.0a Example

#### Creating Clients

```javascript
var Client = new Example.Client({
  key: 'key',
  secret: 'secret'
})
```

#### Example Authentication Flow

```javascript
var query = require( 'querystring' )

// Fetch request tokens
Client.get(
  '/request_token.php',
  {},
  function( error, data, response ) {
    // Parse incoming data
    data = query.parse( data )
    // Store temporary request tokens
    Client.token = {
      key: data.oauth_token,
      secret: data.oauth_token_secret
    }
    // Fetch access tokens with request tokens
    Client.get(
      '/access_token.php',
      {},
      function( error, data, response ) {
        // Again, parse incoming data
        data = query.parse( data )
        // Store the final access tokens
        Client.token = {
          key: data.oauth_token,
          secret: data.oauth_token_secret
        }
      }
    )
  }  
)
```
