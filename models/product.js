const fs = require('fs');
const path = require('path');

// filePath : defines a root directory of the current project.
const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const { getProductsFromFile } = require('./services/fetchProducts');

// import cart model to delete
const Cart = require('./cart');

module.exports = class Product {
    
    constructor(id, title, imageUrl, description, price) {

        // when we create the product for the first time,
        //  we id parameter is null because we won't put id value.
        //  By the way, the parameter must be the first one.

        // this.id is null when we create a product for the first time.
        this.id = id;

        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {

        // 1)
        // Create an id for params (it is dummy);
        // The reason we created id here, not in constructor
        //  is because we do not input id into the class.
        // Id is should be automatically created in the database.

        // if(!this.id) this.id = Math.random().toString();

        // parameters is an empty array (when product.json is not available)
        //      or a current product array parsed from product.json
        getProductsFromFile(products => {
            // For readable, it should be located here.
            
            // In order to edit and save
            if(this.id) {
                const existingProductIndex = products.findIndex(product => this.id === product.id);
                const updatedProducts = [ ... products ];
                updatedProducts[existingProductIndex] = this;

                fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                });
                
            } else {
                // In order to put a product just created.
                this.id = Math.random().toString();                   
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (err) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                });
            }
            
        });
        
    }

    static fetchAll(callback) {

        getProductsFromFile(callback);

    }

    // making new products.json data that the data with this "id" is not availabe
    static deleteById(id) {
        getProductsFromFile(products => {

            // to find price
            const product = products.find(product => product.id === id);

            // 2) By using filter
            const updatedProducts = products.filter(product => product.id !== id);

            // 1) By using findIndex
            // const productIndex = products.findIndex(product => product.id === id);

            fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
                if(!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });      
        });
    }

    static findProductById(id, callback){

        // first callback
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            // console.log('product: ', product);
            
            // second call back that runs in shop.js in controllers
            // The parameter here is an literal object that is produced products.find() abaove
            callback(product);
        });
    }


}