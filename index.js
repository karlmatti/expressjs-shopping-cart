const config = require( "./config" );
const express = require("express")
const api = express()
const apiPrefix = "/api"
const orderPrefix = apiPrefix + "/orders"
const productPrefix = apiPrefix + "/products"

const AppDAO = require('./repository/ApiDAO')
const ProductService = require("./service/productService");
const ProductRepository = require("./repository/productRepository");
const dao = new AppDAO('./database.sqlite3')
const fs = require('fs');
const OrderRepository = require("./repository/orderRepository");
const OrderProductRepository = require("./repository/orderProductRepository");


// -- Load initial DB
let productRepository = new ProductRepository(dao);
productRepository.createTable()
    .then(async () => {
        fs.readFile('./initialProducts.json', (err, data) => {
            if (err) throw err;
            let products = JSON.parse(data);

            products.forEach( async product => {
                if ((await productRepository.getById(product.id)).length === 0) {
                    productRepository.create(product.id, product.name, product.price)
                }
            })
        });
    });
new OrderRepository(dao).createTable();
new OrderProductRepository(dao).createTable();

// -- /api/products/*
// ---- GET
api.get(productPrefix, async (req, res) => {
    const result = await new ProductService(dao).getAll()
    res.send(result);
})

// -- /api/orders/*
// ---- GET
api.get(orderPrefix + "/:order_id", (req, res) => {
    res.send('GET /api/orders/:order_id - get order details');
})
api.get(orderPrefix + "/:order_id/products", (req, res) => {
    res.send('GET /api/orders/:order_id/products - get order products');
})

// ---- POST
api.post(orderPrefix, (req, res) => {

    res.send(req.body);
})
api.post(orderPrefix + "/products", (req, res) => {
    res.send('POST /api/orders/:order_id/products - add products to order');
})

// ---- PATCH
api.patch(orderPrefix + "/:order_id", (req, res) => {
    res.send('PATCH /api/orders/:order_id - update order');
})
api.patch(orderPrefix + "/:order_id/products/:product_id", (req, res) => {
    res.send('PATCH /api/orders/:order_id/products/:product_id - update product quantity');
})




// Start application
api.listen( config.port, () => {
    console.log( 'E-Commerce Cart API is now listening on', config.port );
} );