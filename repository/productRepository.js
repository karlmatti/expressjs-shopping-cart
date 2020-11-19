
class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS product (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255),
        price VARCHAR(255))`

        return this.dao.run(sql)
    }

    create(id, name, price) {
        return this.dao.run(
            `INSERT INTO product (id, name, price)
                VALUES (?, ?, ?)`,
            [id, name, price])
    }

    getAll() {
        return this.dao.all(`SELECT * FROM product`)
    }
    getById(productId) {
        return this.dao.all(`SELECT * FROM product WHERE id = ?`, [productId])
    }


}

module.exports = ProductRepository;