const {v4: uuidv4} = require('uuid');

class OrderProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS order_product (
        id VARCHAR(36) PRIMARY KEY,
        quantity INTEGER NOT NULL,
        orders_id VARCHAR(36) NOT NULL,
        product_id INTEGER NOT NULL,
        replaced_with VARCHAR(36),
        is_replacement INTEGER DEFAULT 0,
        CONSTRAINT orders_id_fk FOREIGN KEY (orders_id)
            REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT product_id_fk FOREIGN KEY (product_id)
            REFERENCES product(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT order_product_id_fk FOREIGN KEY (replaced_with)
            REFERENCES order_product(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        return this.dao.run(sql)
    }

    async getByOrdersId(ordersId) {
        const sql = `SELECT order_product.id, product.name, 
            product.price, order_product.product_id, 
            order_product.quantity, order_product.replaced_with,
            order_product.orders_id
            FROM product LEFT JOIN order_product 
            ON product.product_id=order_product.product_id 
            WHERE order_product.orders_id=? AND order_product.is_replacement=0`
        let orderProducts = this.dao.all(sql, [ordersId])

        return orderProducts.map(async (orderProduct) => {

            if (orderProduct.replaced_with != null) {
                orderProduct.replaced_with = await this.getOrderProductReplacementByOrdersIdAndProductId(
                    orderProduct.orders_id, orderProduct.replaced_with
                )
            } else {
                orderProduct.replaced_with = null
            }
            delete orderProduct.orders_id
            return orderProduct
        })
        //return this.dao.all(sql, [ordersId])
    }


   /* getOrderProductByOrderId(ordersId) {
        let sql = `SELECT product.product_id, product.price, order_product.quantity FROM product
            LEFT JOIN order_product 
            ON product.product_id=order_product.product_id
            WHERE order_product.orders_id=? AND is_replacement=0`
        console.log("@getOrderProductByOrderId ordersId => " + ordersId)
        return this.dao.all(sql, [ordersId])
    }*/
    getOrderProductReplacementByOrdersIdAndProductId(ordersId, productId) {
        let sql = `SELECT order_product.id, product.name, 
            product.price, order_product.product_id, 
            order_product.quantity, order_product.replaced_with      
            FROM product 
            LEFT JOIN order_product 
            ON product.product_id=order_product.product_id
            WHERE order_product.orders_id=? AND order_product.id=? AND is_replacement=1`
        console.log("ordersId = " + ordersId + ", productid = " + productId)
        return this.dao.get(sql, [ordersId, productId])
    }

    getAll() {
        return this.dao.all(`SELECT * FROM order_product`)
    }
    async create(ordersId, productId, quantity = 1, isReplacement = 0) {
        let newId = uuidv4()
        let sql = `INSERT INTO order_product 
                    (id, orders_id, product_id, quantity, replaced_with, is_replacement)
                   VALUES (?, ?, ?, ?, ?, ?)`
        let insertedItem = [newId, ordersId, productId, quantity, null, isReplacement]
        let {isSuccessful} = await this.dao.run(sql, insertedItem)

        return {
            id: newId,
            isSuccessful: isSuccessful
        }

    }

    /*
    insertProducts(products, ordersId) {
        let insertedItems = [];
        let sql = `INSERT INTO order_product (id, orders_id, product_id, quantity, replaced_with)
                VALUES (?, ?, ?, ?, ?)`
        products.forEach(productId => {
            if (productId !== products[0]) sql += `, (?, ?, ?, ?, ?)`;
            let newItem = [uuidv4(), ordersId, productId, 1, null]
            insertedItems.push(newItem)
        })
        return this.dao.run(sql, insertedItems)
    }*/

    updateQuantityByOne(productId, ordersId) {
        return this.dao.run(
            `UPDATE order_product 
            SET quantity = quantity + 1
            WHERE orders_id = ? AND product_id = ?`,
            [ordersId, productId]
        )
    }


    getOrderProductByOrderIdAndByProductId(ordersId, productId) {
        console.log()
        let sql = `SELECT product.product_id, product.price, order_product.quantity  
            FROM product 
            LEFT JOIN order_product 
            ON product.product_id=order_product.product_id
            WHERE order_product.orders_id=? AND order_product.id=?`

        return this.dao.get(sql, [ordersId, productId])
    }
    updateQuantity(ordersId, productId, quantity) {
        console.log("quantity => " + quantity)
        console.log("productId => " + productId)
        console.log("ordersId => " + ordersId)
        return this.dao.run(
            `UPDATE order_product
                 SET quantity = ?
                 WHERE orders_id = ? AND product_id = ?`,
            [quantity, ordersId, productId]
        )
    }
    updateReplacedWith(ordersId, productId, replacedWithId) {
        console.log("replacedWithId => " + replacedWithId)
        console.log("productId => " + productId)
        console.log("ordersId => " + ordersId)
        return this.dao.run(
            `UPDATE order_product
                 SET replaced_with = ? 
                 WHERE orders_id = ? AND id = ?`,
            [replacedWithId, ordersId, productId]
        )
    }
    //createReplacementProduct(productId)
}

module.exports = OrderProductRepository;