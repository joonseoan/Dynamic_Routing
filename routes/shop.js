const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    getIndex, 
    getCart,
    postCart, 
    getCheckout, 
    getOrders, 
    getProduct } = require('../controllers/shop');

router.get('/', getIndex);
router.get('/products', getProducts);

// The line order is a matter here. ******
// If we want to put additional route with /products/*
// It must be placed before params.
// That is, the param must be the last one 
// router.get('/products/additionalRoute');

// adding params
router.get('/products/:id', getProduct);
router.get('/cart', getCart);
router.post('/cart', postCart);
router.get('/orders', getOrders);
router.get('/checkout', getCheckout);

module.exports = router;