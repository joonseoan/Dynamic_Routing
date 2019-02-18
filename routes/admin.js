const express = require('express');
const router = express.Router();

const { 
    getAddProducts,
    getProducts, 
    postAddProducts,
    getEditProduct,
    postEditProduct,
    deleteProduct } = require('../controllers/admin');

    // to display user input ui
    router.get('/addProducts', getAddProducts);
    
    // render user input data into admin/products.ejs 
    router.get('/products',getProducts);
    
    // only to put data from './admin/addProducts'
    router.post('/addProducts', postAddProducts);
    
    router.get('/editProduct/:id', getEditProduct);

    router.post('/editProduct', postEditProduct);

    router.post('/deleteProduct', deleteProduct);

module.exports = router;