const {v4: uuidv4} = require('uuid');
class OrderRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS 'order' (
        id VARCHAR(36) PRIMARY KEY,
        status VARCHAR(255),
        discount VARCHAR(255),
        paid VARCHAR(255),
        returns VARCHAR(255),
        total VARCHAR(255))`

        return this.dao.run(sql)
    }
}

module.exports = OrderRepository;