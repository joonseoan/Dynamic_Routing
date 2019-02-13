const express = require('express');
const router = express.Router();

const { 
    getAddProducts,
    getProducts, 
    postAddProducts } = require('../controllers/admin');

// to display user input ui
router.get('/addProducts', getAddProducts);

// render user input data into admin/products.ejs 
router.get('/products',getProducts);

// only to put data from './admin/addProducts'
router.post('/addProducts', postAddProducts);

module.exports = router;