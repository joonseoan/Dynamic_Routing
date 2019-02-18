const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const { getProductsFromFile } = require('./services/fetchProducts');

// import cart model to delete
const Cart = require('./cart');

module.exports = class Product {
    
    constructor(id, title, imageUrl, description, price) {

        // when we create the product for the first time,
        //  'id' parameter is null because it will put 'null'.
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

        // 2)
        // parameter is an empty array (when product.json is not available)
        //      or a current product array parsed from 'products.json'
        getProductsFromFile(products => {
            
            // In order to edit and save
            // this.id <= this input value new Product(id, title.....)

            // this.id is from <input type="hidden" name="id" value=product.id> through postEditProduct in controllers/routes
            if(this.id) {
                const existingProductIndex = products.findIndex(product => this.id === product.id);
                const updatedProducts = [ ...products ];

                // deep clone and save are required because it changed element's field value ****.
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                });
                
            // In order to put a new product just created.
            } else {
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

            // to find price from the identified element
            const product = products.find(product => product.id === id);

            // 2) to delete the identified elelment by using filter
            const updatedProducts = products.filter(product => product.id !== id);

            // 1) By using findIndex
            // const productIndex = products.findIndex(product => product.id === id);

            // overwrite 'products.json' with updated product list 
            fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {

                // Then, overwrite 'data.json' by using a static method of Cart class
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