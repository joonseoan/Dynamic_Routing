const fs = require('fs');
const path = require('path');

// filePath : defines a root directory of the current project.
const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const { getProductsFromFile } = require('./services/fetchProducts');

module.exports = class Product {
    
    constructor(title, imageUrl, description, price) {

        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {

        // Create an id for params (it is dummy);
        // The reason we created id here, not in constructor
        //  is because we do not input id into the class.
        // Id is should be automatically created in the database.
        this.id = Math.random().toString();

        // parameters is an empty array (when product.json is not available)
        //      or a current product array parsed from product.json
        getProductsFromFile(products => {                        
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (err) => {
                if(err) {
                    console.log(err);
                    return;
                }
            });
        });
        
    }

    static fetchAll(callback) {

        getProductsFromFile(callback);

    }

    static findProductById(id, callback){

        // first callback
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            console.log('product: ', product);
            
            // second call back that runs in shop.js in controllers
            callback(product);
        });
    }

}