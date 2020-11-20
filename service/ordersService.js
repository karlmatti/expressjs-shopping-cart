const OrdersRepository = require('../repository/ordersRepository')
const OrderProductRepository = require('../repository/orderProductRepository')
const ProductService = require("./productService");


class OrdersService {
    constructor(dao) {
        this.ordersRepository = new OrdersRepository(dao);
        this.orderProductRepository = new OrderProductRepository(dao);
        this.productService = new ProductService(dao);
    }


    async create() {
        // TODO: if status paid then cannot add new items
        let newOrder = await this.ordersRepository.create()
        newOrder.products = []
        return newOrder
    }

    async insertProductAndUpdateTotal(products, ordersId) {
        const productObjects = await this.orderProductRepository.getOrderProductByOrderId(ordersId);
        const productIds = productObjects.map(({ product_id }) => product_id)

        for (const productId of products) {
           if (productIds.includes(productId)) {
                await this.orderProductRepository.updateQuantityByOne(productId, ordersId)
            } else {
                await this.orderProductRepository.create(productId, ordersId)
            }
        }
        await this.updateTotal(ordersId)

        return "OK"
    }
    async updateTotal(ordersId) {
        let updatedProductObjects = await this.orderProductRepository.getOrderProductByOrderId(ordersId);
        let total = this.calculateTotal(updatedProductObjects);
        let totalString = total.toFixed(2)
        console.log("ordersId " + ordersId )
        console.log(" new total is " + totalString)
        return await this.ordersRepository.updateTotal(totalString, ordersId)
    }
    calculateTotal(products){
        // let products example value: [ { product_id: 123, price: '0.45', quantity: 2 } ]
        let total = 0;
        products.forEach(product => {
            total += parseFloat(product.price) * product.quantity
        })
        return total;
    }
    async getById(id) {
        return await this.ordersRepository.getById(id).then(async (order) => {
            let newOrder = {
                amount: {
                    discount: order.discount,
                    paid: order.paid,
                    returns: order.returns,
                    total: order.total
                },
                id: order.id,
                status: order.status
            }
            newOrder["products"] = await this.orderProductRepository.getByOrderId(id)
                .then(products => {
                    console.log("products " + products)
                    if (products) {
                        return products
                    } else {
                        return []
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            return newOrder;
        })
    }
    getOrderProductById(orderId) {
        return this.orderProductRepository.getByOrderId(orderId)
    }

    updateOrder(orderId, newValues) {
        if (newValues.status === "PAID") {
            return this.ordersRepository.updateStatusToPaid(orderId, newValues.status)
        } else {
            return "Invalid parameters"
        }
    }

    async updateOrderProduct(ordersId, productId, newValues) {
        if (newValues.replaced_with) {
            console.log("replaced_with")
            return "replaced_with"
        } else if (newValues.quantity) {
            console.log("quantity")
            return await this.ordersRepository.getById(ordersId)
                .then(async order => {
                    if (order.status === "NEW") {

                        let product = await this.productService.getById(productId)

                        return await this.orderProductRepository
                            .updateQuantity(ordersId, product.product_id, newValues.quantity)
                            .then(async() => {
                                return await this.updateTotal(ordersId)
                                    .then(() => {
                                        return '"OK"'
                                    })

                            })
                            .catch(err => {return err})
                    } else {
                        return '"Invalid order status"' // TODO: add error code 400
                    }
                })
        } else {
            return "Invalid parameters"
        }

        //return this.orderProductRepository.updateQuantity(orderId, productId, newValues)
    }

}

module.exports = OrdersService;