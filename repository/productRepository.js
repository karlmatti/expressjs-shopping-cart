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
        product_id INTEGER UNIQUE)`

        return this.dao.run(sql)
    }

    create(productId, name, price) {
        let newId = uuidv4()

        let result = this.dao.run(
            `INSERT INTO product (id, name, price, product_id)
                VALUES (?, ?, ?, ?)`,
            [newId, name, price, productId])
        result.id = newId
        return result

    }

    getAll() {
        return this.dao.all(`SELECT product_id AS id, name, price FROM product`)
    }

    getByProductId(productId) {

        return this.dao.get(`SELECT * FROM product WHERE product_id = ?`, [productId])
    }
    getById(id) {
        return this.dao.get(`SELECT * FROM product WHERE id = ?`, [id])
    }


}

module.exports = ProductRepository;