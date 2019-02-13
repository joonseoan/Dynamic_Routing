const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'carts.json');

module.exports = class Cart {

    // constructor() {
    //     this.products = [];
    //     this.totalPrice = 0;
    // }

    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(filePath, (err, res) => {
            
            let cart = { products: [], totalPrice: 0 };
            
            if(!err) {
                cart = JSON.parse(res);
            }
            
            // Analyze the cart => Find the existing products
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            console.log('existingProductIndex from findIndex(): ', existingProductIndex)
            const existingProduct = cart.products[existingProductIndex];

            
            let updatedProduct;

            // Add new Product / increase quantity
            if(existingProduct) {
                // just copy the products filtered by find() above
                //  into an lteral object form
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [ ...cart.products, updatedProduct ];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id, qty: 1};
                cart.products = [ ...cart.products, updatedProduct ];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.log(err);
            });
        });

    }

}