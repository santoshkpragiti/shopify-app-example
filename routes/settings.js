const express = require('express');
const router = express.Router();
const ShopifyToken = require('../services/shopify-token');

/* Global Settings */
/* TODO: Need to create middleware for validating that subscriber has cookie */
router.get('/', (req, res, next) => {

  if (req.query.shop && req.session.ShopifyTokens[req.query.shop]) {
    //Get the token from the session
    const token = req.session.ShopifyTokens[req.query.shop];

    //Render the Settings Index with EASDK skeleton
    return res.render('settings/index', {token, apiKey: ShopifyToken.apiKey, shop: req.query.shop });
  }
  else {
    // return res.redirect('/auth/shopify');
    return res.send('Error');
  }

});


module.exports = router;