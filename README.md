[![build status](https://secure.travis-ci.org/jhermsmeier/node-client-oauth.png)](http://travis-ci.org/jhermsmeier/node-client-oauth)
# Node.js OAuth Client Library

## Install via [npm](http://npmjs.org)

```
npm install client-oauth
```

## OAuth 1.0a

### Usage

```javascript
var example = new OAuth[1.0]({
  base: 'http://term.ie/oauth/example',
  key: 'key',
  secret: 'secret'
})
```

Possible options:

```javascript
{
  // API endpoint base URL
  base: '',
  // Consumer token
  key: '',
  // Consumer secret
  secret: '',
  // OAuth signature method
  signature_method: 'HMAC-SHA1',
  // HTTP request headers
  headers: {
    'Accept': '*/*',
    'Connection': 'Close',
    'User-Agent': 'node.js/client-oauth'
  }
}
```

```javascript
var user = new example.Client()
```

```javascript
user.get(
  '/request_token.php', null,
  function( error, data, response ) {
    if( response && response.statusCode ) {
      console.log( response.statusCode )
      console.log( data )
    } else {
      console.log( error )
    }
  }
)
```
