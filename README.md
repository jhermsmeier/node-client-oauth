# Node.js OAuth

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

## License (MIT)

Copyright (c) 2012 [Jonas Hermsmeier](http://jhermsmeier.de)

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in  
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN  
THE SOFTWARE.
