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

    // static function inside of callback

    // in order to get detail product info from products.json
    //  create a cart product list
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData) {
                    console.log('cartProductData: ', cartProductData)
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts
            });
        });

    });

}

exports.postCart = (req, res, next) => {

    /* 
        <form action='/cart' method="POST">
            <button class="btn" type="submit">Add To Cart</button>
            <!-- 'hidden' does not display the input -->
            <input type="hidden" name="id" value="<%= product.id %>">
        </form>
    */
    // id is from the one above in /includes/addToCart.ejs
    const id = req.body.id;

    Product.findProductById(id, product =>{
        // console.log('product@findProdut : ', product);
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

exports.postCartDeleteItem = ( req, res, next) => {
    const { id }= req.body;

    Product.findProductById(id, product => {
        console.log('deleteCartPRODUCT ITEM: ', product)
        Cart.deleteProduct(id, product.price);
        res.redirect('/cart');
    });

}

exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });

}