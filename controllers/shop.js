const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {

    // error : no products.json file or empty array in products.json file.
    // when 'error' with products.length == 0, it returns [] to shop.ejs file.
    Product.fetchAll(products => {
        res.render('shop/productList', { 
            products, 
            docTitle: 'All Products', 
            path: '/products'
         });
    });
        
}

exports.getProduct = (req, res, next) => {
    
    // id must be identified with router.get('/products/:id')
    const id = req.params.id;

    // 'Product' is defined because we need to find a document out of all documents in a collection.
    Product.findProductById(id, product => {
        res.render('shop/productDetail', {
            product,
            docTitle: product.title,
            path: '/products'
        });
    });

}

exports.getIndex = (req, res, next) => {

    Product.fetchAll(products => {
        res.render('shop/index', { 
            products, 
            docTitle: 'Shop', 
            path: '/'
         });
    });

 }

// '/shop/cart' is wrong. 
// 'shop/cart' is correct.
exports.getCart = (req, res, next) => {

    res.render('shop/cart', {
        docTitle: 'Your Cart',
        path: '/cart'
    });

}

exports.postCart = (req, res, next) => {
    const id = req.body.id;
    // console.log('id at postCart', id);
    Product.findProductById(id, product =>{
        Cart.addProduct(product.id, product.price);
    });
    res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {

    res.render('shop/orders', {
        docTitle: 'Your Orders',
        path: '/orders'
    });
}

exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
}

