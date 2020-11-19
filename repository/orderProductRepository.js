
class OrderProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS order_product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quantity INTEGER,
        order_id VARCHAR(36),
        CONSTRAINT order_id_fk FOREIGN KEY (order_id)
            REFERENCES order(id) ON UPDATE CASCADE ON DELETE CASCADE,
        product_id INTEGER,
        CONSTRAINT product_id_fk FOREIGN KEY (product_id)
            REFERENCES product(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        return this.dao.run(sql)
    }
}

module.exports = OrderProductRepository;