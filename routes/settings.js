const express = require('express');
const path = require('path');
const router = express.Router();
const ShopifyToken = require('../services/shopify-token');

/* Global Settings */
/* TODO: Need to create middleware for validating that subscriber has cookie */
router.get('/', (req, res, next) => {

  if (req.query.shop && req.query.apiKey && req.session.ShopifyTokens && req.session.ShopifyTokens[req.query.shop]) {
    //Render the Settings Index with EASDK skeleton
    //return res.render('settings/index', {token, apiKey: ShopifyToken.apiKey, shop: req.query.shop });
    
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  }
  else {
    return res.redirect('/auth/shopify'); 
  }

});


module.exports = router;