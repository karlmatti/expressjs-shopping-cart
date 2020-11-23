const fs = require('fs');
const ProductRepository = require("./repository/productRepository");
const OrderRepository = require("./repository/ordersRepository");
const OrderProductRepository = require("./repository/orderProductRepository");

// -- Load initial DB
function loadDB (dao) {
    let productRepository = new ProductRepository(dao);
    productRepository.createTable()
        .then(async () => {
            fs.readFile('./initialProducts.json', (err, data) => {
                if (err) throw err;
                let products = JSON.parse(data);

                products.forEach( async product => {

                    if ((await productRepository.getByProductId(product.id)) === undefined) {
                        productRepository.create(product.id, product.name, product.price)
                    }
                })
            });
        });
    new OrderRepository(dao).createTable();
    new OrderProductRepository(dao).createTable();
}
module.exports = loadDB