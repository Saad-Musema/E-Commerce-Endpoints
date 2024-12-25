const express = require("express")
const Product = require('../model/product.mongo');

const {addProduct,
    getAllProducts,
    getProductWithID,
    deleteProduct,
    updateProduct} = require("../controller/product.controller")



const productRouter = express.Router();


productRouter.post('/', addProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/:psn', getProductWithID)
productRouter.patch('/:psn', updateProduct)
productRouter.delete('/:psn', deleteProduct)

module.exports = productRouter;