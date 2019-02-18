const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'carts.json');

module.exports = class Cart {

    // It does not need to define the default attribute.
    // constructor() {
    //     this.products = [];
    //     this.totalPrice = 0;
    // }

    static addProduct(id, productPrice) {
    
        // Fetch the previous cart
        fs.readFile(filePath, (err, res) => {

            let updatedProduct;
            
            // cart: {"products":[{"id":"0.9675189185981483","qty":2},{"id":"0.9818511377216477","qty":1}],"totalPrice":390.98}
            let cart = { products: [], totalPrice: 0 };
            
            if(!err) {

                // JSON.parse() is a must-have first step to read a file-based database
                cart = JSON.parse(res);
            }
            
            // Analyze the cart => Find the existing products

            // finding index number
            // If findings in the condition is not available it returns -1 (not error)
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            
            // [Array methods]
            // findIndex : returns index number of element(s) in an arry
            // find : returns element(s) if the condition is true
            // ref] findOne is a query of mongoDB
            console.log('existingProductIndex from findIndex(): ', existingProductIndex); // => 0 
            
            // get an entire element
            // When the existingProductIndex is -1, existingProduct = undefined. (Not en error)
            const existingProduct = cart.products[existingProductIndex];

            // Add new Product / increase quantity
            // when existingProductIndex === -1 (when the product does not exist)
            if(existingProduct) {
                // just copy the products filtered by find() above
                //  into an lteral object form
                updatedProduct = { ...existingProduct };
                
                // updated deep-cloned object
                updatedProduct.qty = updatedProduct.qty + 1;

                // cart.products = [ ...cart.products ];
                cart.products[existingProductIndex] = updatedProduct;

            } else {

                updatedProduct = { id, qty: 1};

                // *********************** Deep Clone!!!!
                cart.products = [ ...cart.products, updatedProduct ];

            }

            // +productPrice :  type (String -> Number)
            cart.totalPrice = cart.totalPrice + +productPrice;  
            
            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.log(err);
            });

        });

    }

    static deleteProduct(id, price) {

        fs.readFile(filePath, (err, res) => {

            if(err) {
                return;
            }

            // must be object type that javascript can read.
            //      when we read a file 
            const updatedCart = { ...JSON.parse(res) };
            
            // { id: xxxx, qty: 2 }
            // To find qty from the identified product
            const product = updatedCart.products.find(product => product.id === id);
            
            // When the product in cart is deleted ahead of deleting that product in admin/products
            if(!product) {
                return;
            }
            
            //
            const prodcutQty = product.qty;
            
            // to remove the product from the array
            updatedCart.products = updatedCart.products.filter(product => product.id !== id);
            
            // substract the total price of a product with price * qty for now
            // it will be modified later on
            updatedCart.totalPrice = updatedCart.totalPrice - (price * prodcutQty);

            fs.writeFile(filePath, JSON.stringify(updatedCart), err => {
                console.log(err);
            })
        });
    }   

    static getCart(callback) {
        fs.readFile(filePath, (err, res) => {
            const productsInCart = JSON.parse(res);
            if(err) {
                // undefined: noting to show
                callback(null);
            } else {
                callback(productsInCart);
            }
        });
    }

}