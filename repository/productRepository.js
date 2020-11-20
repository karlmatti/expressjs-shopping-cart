const {v4: uuidv4} = require('uuid');
class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS product (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        price VARCHAR(255),
        product_id INTEGER)`

        return this.dao.run(sql)
    }

    create(productId, name, price) {
        return this.dao.run(
            `INSERT INTO product (id, name, price, product_id)
                VALUES (?, ?, ?, ?)`,
            [uuidv4(), name, price, productId])
    }

    getAll() {
        return this.dao.all(`SELECT product_id AS id, name, price FROM product`)
    }

    getById(productId) {
        return this.dao.all(`SELECT * FROM product WHERE product_id = ?`, [productId])
    }


}

module.exports = ProductRepository;