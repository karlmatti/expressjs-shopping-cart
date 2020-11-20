const ProductRepository = require('../repository/productRepository')

class ProductService {
    constructor(dao) {
        this.repository = new ProductRepository(dao);
    }


    async getAll() {
        return this.repository.getAll();;
    }



}

module.exports = ProductService;


