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
            
            // cart: {"products":[{"id":"0.9675189185981483","qty":2},{"id":"0.9818511377216477","qty":1}],"totalPrice":390.98}
            let cart = { products: [], totalPrice: 0 };
            
            if(!err) {
                cart = JSON.parse(res);
            }
            
            // Analyze the cart => Find the existing products

            // finding index number
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            
            // [Array methods]
            // findIndex : returns index number of element(s) in an arry
            // find : returns element(s) if the condition is true
            // findOne: returns an element if the condition is true
            console.log('existingProductIndex from findIndex(): ', existingProductIndex) // => 0 
            
            // get an entire element
            const existingProduct = cart.products[existingProductIndex];
            
            let updatedProduct;

            // Add new Product / increase quantity
            // when existingProductIndex === -1 (when the product does not exist)
            if(existingProduct) {
                // just copy the products filtered by find() above
                //  into an lteral object form
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;

                // cart.products = [ ...cart.products ];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id, qty: 1};
                cart.products = [ ...cart.products, updatedProduct ];
            }
            // +productPrice :  type (String -> Number)
            cart.totalPrice = cart.totalPrice + +productPrice;  
            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.log(err);
            });
        });

    }

}