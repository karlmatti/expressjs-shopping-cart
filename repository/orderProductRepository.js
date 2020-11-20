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
        CONSTRAINT orders_id_fk FOREIGN KEY (orders_id)
            REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT product_id_fk FOREIGN KEY (product_id)
            REFERENCES product(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT order_product_id_fk FOREIGN KEY (replaced_with)
            REFERENCES order_product(id) ON UPDATE CASCADE ON DELETE CASCADE,
        UNIQUE(orders_id, product_id))`
        return this.dao.run(sql)
    }

    getByOrderId(orderId) {
        const sql = `SELECT product.id, product.name, 
            product.price, order_product.product_id, 
            order_product.quantity, order_product.replaced_with 
            FROM product LEFT JOIN order_product 
            ON product.product_id=order_product.product_id 
            WHERE order_product.orders_id=?`
        return this.dao.all(sql, [orderId])
    }
    getAll() {
        return this.dao.all(`SELECT * FROM order_product`)
    }
    create(productId, ordersId) {
        let sql = `INSERT INTO order_product (id, orders_id, product_id, quantity, replaced_with)
                   VALUES (?, ?, ?, ?, ?) `
        let insertedItem = [uuidv4(), ordersId, productId, 1, null]

        return this.dao.run(sql, insertedItem)
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

    updateQuantity(productId, ordersId) {
        return this.dao.run(
            `UPDATE order_product 
            SET quantity = quantity + 1
            WHERE orders_id = ? AND product_id = ?`,
            [ordersId, productId]
        )
    }
    getOrderProductByOrderId(ordersId) {
        let sql = `SELECT product.product_id, product.price, order_product.quantity  FROM product 
            LEFT JOIN order_product 
            ON product.product_id=order_product.product_id
            WHERE order_product.orders_id=?`
        return this.dao.all(sql, [ordersId])
    }
    //createReplacementProduct(productId)
}

module.exports = OrderProductRepository;