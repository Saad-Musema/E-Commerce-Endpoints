const express = require("express")
const Product = require('../model/product.mongo');




const productRouter = express.Router();


productRouter.post('/')
productRouter.get('/')
productRouter.put('/')
productRouter.delete('/')

module.exports = productRouter;