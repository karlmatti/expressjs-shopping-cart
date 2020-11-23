const chai = require('chai')
const expect = chai.expect

const OrderService = require("../service/OrdersService");
const orderService = new OrderService({}); // Testing business logic without any DAO


describe("orderService calculateAmounts(orderProducts)", () => {


    it("should return correct amounts when replaced product prices are higher", ()=> {
        let orderProducts = [
            {
                "price":"0.45",
                "quantity":2,
                "replaced_with":
                    {
                        "price":"1333.37",
                        "quantity":6,
                    }
            },
            {
                "price":"1333.37",
                "quantity":2,
                "replaced_with":null
            }
        ]
        let expected = {
            discount: 7999.32.toFixed(2),
            paid: 2667.64.toFixed(2),
            returns: 0.0.toFixed(2),
            total:10666.96.toFixed(2)
        }
        let actual = orderService.calculateAmounts(orderProducts)
        expect(actual).to.eql(expected)
    })

    it("should return correct amounts when replaced product prices are lower", ()=> {
        let orderProducts = [
            {
                "price":"1333.37",
                "quantity":2,
                "replaced_with":
                    {
                        "price":"0.45",
                        "quantity":6,
                    }
            },
            {
                "price":"1333.37",
                "quantity":2,
                "replaced_with":null
            }
        ]
        let expected = {
            discount: 0.0.toFixed(2),
            paid: 5333.48.toFixed(2),
            returns: 2664.04.toFixed(2),
            total: 2669.44.toFixed(2)
        }
        let actual = orderService.calculateAmounts(orderProducts)
        expect(actual).to.eql(expected)
    })


})
describe("orderService multiply(number1, number2)", () => {


    it("should return correct multiplication result for 2*3", ()=> {
        expect(orderService.multiply(2, 3)).to.eql(2 * 3)
    })

    it("should return correct multiplication result for 6*7", ()=> {
        expect(orderService.multiply(6, 7)).to.eql(6 * 7)
    })

})



describe("orderService calculateTotal(products)", () => {
    //[ { product_id: 123, price: '0.45', quantity: 2 } ]

    it("should return correct total value from list of 1 product", ()=> {
        let products = [ { product_id: 123, price: '0.45', quantity: 2 } ]
        expect(orderService.calculateTotal(products)).to.eql(2 * 0.45)
    })

    it("should return correct total value from list of 3 products", ()=> {
        let products = [
            { product_id: 123, price: '0.45', quantity: 2 },
            { product_id: 124, price: '1.00', quantity: 2 },
            { product_id: 125, price: '0.55', quantity: 2 }
            ]
        let expected = 0;
        products.forEach(product => {
            expected += parseFloat(product.price) * product.quantity
        })

        expect(orderService.calculateTotal(products)).to.eql(expected)
    })

})


