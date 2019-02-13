const Product = require('../models/product');

// simply to get input ui
exports.getAddProducts = (req, res, next) => {

    res.render('admin/addProducts', {
        docTitle: 'Add Products',
        path: '/admin/addProducts',
        activeAddProducts: true,
        productCSS: true
    });

}

// to get all data and render data to /admin/products and then to /admin/products ejs file
exports.getProducts = (req, res, next) => {

    // 'Product' to get all documents from 'collection' (or class)
    // Therefore, we need to define 'static' for this function in the class.

    // 'products' parameter is an array from 'callback(JSON.parse(res))'
    // The parameter is always defined in the function invoking this callback
    Product.fetchAll(products => {

        res.render('admin/products', { 
            products, 
            docTitle: 'Admin Products', 
            path: '/admin/products'
      
        });

    });

}

// to transfer 'user input data' to the database
exports.postAddProducts = (req, res, next) => {
    
    console.log('req.body.title: ', req.body.title);

    const {title, imageUrl, description, price } = req.body;
    
    // 'product' for a particular document, not for all ducuments in a collectionn. 
    const product = new Product(title, imageUrl, description, price);

    product.save();

    res.redirect('/');

}