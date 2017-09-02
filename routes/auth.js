const express = require('express');
const router = express.Router();
const ShopifyToken = require('../services/shopify-token');

/* Shopify Auth Initialization */
router.get('/shopify', (req, res, next) => {

  if (req.query.shop && req.query.shop.includes('.myshopify.com')) {
    //Get the shop handle from <shop>.myshopify.com
    const shopHandle = req.query.shop.split(".myshopify.com")[0];

    //Define the scopes
    const scopes = "read_orders,read_products,read_script_tags,write_script_tags";

    //Use the ShopifyToken module to generate the Url
    const authUrl = ShopifyToken.generateAuthUrl(shopHandle, scopes);

    //Render the redirection html (EASDK)
    return res.render('auth/shopify', {
      authUrl,
      shopHandle
    });
  }
  else {
    return res.render('auth/index');
  }

});

/* Shopify Auth Callback */
router.get('/shopify/callback', function(req, res, next) {

  //console.log(req.query);

  if (!ShopifyToken.verifyHmac(req.query)) {
    return res.status(403).end("Authentication failed. Please access this app from your Shopify Store Admin Panel");
  }

  const code = req.query.code;
  const hostname = req.query.shop;

  ShopifyToken.getAccessToken(hostname, code)
    .then((token) => {
      // Shop name
      const shopHandle = hostname.split('.myshopify.com')[0];

      if (req.session.ShopifyTokens) {
        req.session.ShopifyTokens[shopHandle] = token;
      }
      else {
        req.session.ShopifyTokens = {
          shopHandle: token
        };
      }

      res.send(token);

    });
});

module.exports = router;