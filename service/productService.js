const ProductRepository = require('../repository/productRepository')

class ProductService {
    constructor(dao) {
        this.repository = new ProductRepository(dao);
    }


    getAll() {
        return this.repository.getAll()
    }

    getByProductId(productId) {
        return this.repository.getByProductId(productId)
    }

    getById(id) {
        return this.repository.getById(id)
    }



}

module.exports = ProductService;


