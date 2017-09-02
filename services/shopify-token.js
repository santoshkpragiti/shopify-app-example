const ShopifyToken = require('shopify-token');

// Require the keys to configure the helper
const keys = require('config/keys');

// Initialize once to be shared across the application 
const shopifyToken = new ShopifyToken({
  sharedSecret: keys.sharedSecret,
  redirectUri: keys.redirectUri,
  apiKey: keys.apiKey
});

module.exports = shopifyToken;