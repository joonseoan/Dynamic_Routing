const Product = require('../models/product');

// -------------------------------------------------------------------------------------------------
//  A Same View but different Controllers when the input ux/ui should be shared

// simply to get input ui
exports.getAddProducts = (req, res, next) => {

    res.render('admin/editProducts', {
        docTitle: 'Add Products',
        path: '/admin/addProducts',
        editing: false
      
    });

}

exports.getEditProduct = (req, res, next) => {

    // We can always check the query by using 'req.query'.
    //      'req.query' is managed by express, by the way.
    // Therefore, it can track down 'edit true'and title=new' of /12345?edit=true&title=new
    console.log('req.query: ', req.query); // => req.query:  { edit: 'true', new: 'title' }

    // Based on '/12345?edit=true&title=new'
    // the value of the down below is String "true" instead of Boolean true
    const editMode = req.query.edit;
    console.log('editMode:', editMode);

    if(!editMode) return res.redirect('/');

    const id = req.params.id;
    Product.findProductById(id, product => {

        // product is an array element
        if(!product) res.redirect('/');

        res.render('admin/editProducts', {
            docTitle: 'Edit Product',
            path: '/admin/editProducts',
            // to differentiate getAddProduct
            editing: editMode,
            product
        });
        
    });

}

// --------------------------------------------------------------------------------------------------------

exports.postEditProduct = (req, res, next) => {

    const { id, title, imageUrl, description, price  } = req.body;
    const updatedTitle = title;
    const updatedImageUrl = imageUrl;
    const updatedDescription = description;
    const updatedPrice = price;
    
    const updatedProduct = new Product(id, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);

    updatedProduct.save();

    res.redirect('/admin/products');
    
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
    const product = new Product(null, title, imageUrl, description, price);

    product.save();

    res.redirect('/');

}

exports.deleteProduct = (req, res, next) => {
    const { id } = req.body;
    Product.deleteById(id);
    res.redirect('/admin/products');

}