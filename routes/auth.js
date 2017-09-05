const express = require('express');
const router = express.Router();
const ShopifyToken = require('../services/shopify-token');

/* Shopify Auth Initialization */
router.get('/shopify', (req, res, next) => {
  
  console.log('I am here in the auth shopify');

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

  //code comming from shopify
  const code = req.query.code;
  //Complete shop name including .myshopify.com
  const shop = req.query.shop;

  ShopifyToken.getAccessToken(shop, code)
    .then((token) => {

      if (req.session.ShopifyTokens) {
        req.session.ShopifyTokens[shop] = token;
      }
      else {
        req.session.ShopifyTokens = {
          shop: token
        };
      }
      res.redirect('/settings?shop=' + shop + '&apiKey=' + ShopifyToken.apiKey);
    })
    .catch((err) => next(err));
});

module.exports = router;