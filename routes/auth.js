var express = require('express');
var router = express.Router();
const ShopifyToken = require('../services/shopify-token');

/* Shopify Auth Initialization */
router.get('/shopify', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;