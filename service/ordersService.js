const OrdersRepository = require('../repository/ordersRepository')
const OrderProductRepository = require('../repository/orderProductRepository')


class OrdersService {
    constructor(dao) {
        this.ordersRepository = new OrdersRepository(dao);
        this.orderProductRepository = new OrderProductRepository(dao);
    }


    async create() {
        let newOrder = await this.ordersRepository.create()
        newOrder.products = []
        return newOrder
    }

    async insertProduct(products, orderId) {
        // TODO: get products existing
            // TODO: post products that are not listed on order
            // TODO: update quantity on products that are not listed on order
        for (const productId of products) {

            await this.orderProductRepository.create(productId, orderId)
        }
        /*
        return await this.orderProductRepository.insertProducts(products, orderId)
            .then(res => {return "OK"})
            .catch(err => {return "Invalid parameters"})*/
    }

    async getById(id) {
        let orderById = await this.ordersRepository.getById(id).then(async(order) => {
            // TODO: get products and link to the order
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
                    console.log("products "+products)
                    if (products) {return products} else {return []}
                })
                .catch(err => {console.log(err)})
            //products ? order["products"] = products : order["products"] = []
            //order["products"] = await this.orderProductRepository.getByOrderId(id);

            return newOrder;
        })
        console.log(orderById)
        //orderById["products"] = await this.orderProductRepository.getByOrderId(id);
        return orderById
    }
    getOrderProductById(orderId) {
        return this.orderProductRepository.getByOrderId(orderId)
    }
}

module.exports = OrdersService;