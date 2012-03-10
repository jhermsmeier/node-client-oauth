# OAuth 1.0

## Options

```javascript
{
  // Consumer credentials
  consumer: {
    key: '',
    secret: ''
  },
  // Consumer access tokens
  token: {
    key: '',
    secret: ''
  },
  // Request options
  options: {
    // API base URL
    baseUrl: '',
    // Request token URL
    tokenUrl: '',
    // Access token URL
    accessUrl: '',
    // OAuth signature method
    signatureMethod: 'HMAC-SHA1',
    // HTTP headers
    headers: {
      'User-Agent': 'Some boring UA string'
    }
  }
}
```