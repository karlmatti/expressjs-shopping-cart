const config = require( "./config" );
const express = require("express")
const api = express()
const loadDB = require("./LoadDB");

const ApiDAO = require('./repository/ApiDAO')
const dao = new ApiDAO('./database.sqlite3')

const OrderService = require("./service/OrdersService");
const orderService = new OrderService(dao);

const ProductService = require("./service/ProductService");
const productService = new ProductService(dao);

let apiPrefix = '/api'
let productPrefix = apiPrefix + '/products'
let orderPrefix = apiPrefix + '/orders'
api.use(express.json({type: '*/*'}));
// -- Products API --
// ---- GET ----
api.get(productPrefix, async (req, res) => {
    const products = await productService.getAll()
    res.send(products);
})

// -- /api/orders/*
// ---- GET
api.get(orderPrefix + "/:order_id", async(req, res) => {
    res.send(await orderService.getById(req.params.order_id));
})
api.get(orderPrefix + "/:order_id/products", async (req, res) => {
    res.send(await orderService.getOrderProductById(req.params.order_id))
})



// ---- POST
api.post(orderPrefix, async (req, res) => {

    res.send(await (orderService.create()));
})
api.post(orderPrefix + "/:order_id/products", async (req, res) => {
    res.send(await (orderService.insertProductAndUpdateTotal(req.body, req.params.order_id)))

    //res.send('POST /api/orders/:order_id/products - add products to order');
})

// ---- PATCH
api.patch(orderPrefix + "/:order_id", async(req, res) => {
    let {statusCode, statusMsg} = await (orderService.updateOrder(req.params.order_id, req.body))
    res.status(statusCode)
    res.send(statusMsg)

})
api.patch(orderPrefix + "/:order_id/products/:product_id", async(req, res) => {
    let {statusMsg, statusCode} = await (orderService.updateOrderProduct(req.params.order_id, req.params.product_id, req.body))
    res.status(statusCode)
    res.send(statusMsg)
})


// Start application
api.listen( config.port, () => {
    console.log( 'E-Commerce Cart API is now listening on', config.port );
    console.log( 'Booting up the database...')
    loadDB(dao)
} );