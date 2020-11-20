const {v4: uuidv4} = require('uuid');
class OrdersRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        status VARCHAR(255),
        discount VARCHAR(255),
        paid VARCHAR(255),
        returns VARCHAR(255),
        total VARCHAR(255))`

        return this.dao.run(sql)
    }

    create() {
        const newOrder = {
            id: uuidv4(),
            status: "NEW",
            amount: {
                discount: "0.00",
                paid: "0.00",
                returns: "0.00",
                total: "0.00"
            }
        }
        return this.dao.run(
            `INSERT INTO orders (id, status, discount, paid, returns, total)
        VALUES (?, ?, ?, ?, ?, ?)`,
            [newOrder.id, newOrder.status,
                newOrder.amount.discount, newOrder.amount.paid,
                newOrder.amount.returns, newOrder.amount.total])
            .then(res => {return newOrder})
            .catch(err => {return "Invalid parameters"})
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM orders WHERE id = ?`,
            [id])
    }
}

module.exports = OrdersRepository;