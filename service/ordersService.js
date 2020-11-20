const OrdersRepository = require('../repository/ordersRepository')
const OrderProductRepository = require('../repository/orderProductRepository')


class OrdersService {
    constructor(dao) {
        this.ordersRepository = new OrdersRepository(dao);
        this.orderProductRepository = new OrderProductRepository(dao);
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
                await this.orderProductRepository.updateQuantity(productId, ordersId)
            } else {
                await this.orderProductRepository.create(productId, ordersId)
            }
        }
        let updatedProductObjects = await this.orderProductRepository.getOrderProductByOrderId(ordersId);
        let total = this.calculateTotal(updatedProductObjects);
        let totalString = total.toFixed(2)

        await this.ordersRepository.updateTotal(totalString, ordersId)

        return "OK"
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

    updateStatus(orderId, newValues) {
        if (newValues.status === "PAID") {
            return this.ordersRepository.updateStatusToPaid(orderId, newValues.status)
        } else {
            return "Invalid parameters"
        }

    }

}

module.exports = OrdersService;