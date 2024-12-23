const Product = require("../model/product.mongo")

async function addProduct(req, res){

    const product = new Product(req.body);


    if(await products.findOne({PSN: product.PSN})){
        return res.status(500).send("Product with this PSN already exists!");
    }


    try{
        await product.save(product);
        res.status(201).send("Product has been added!")
    }
    catch(error) {
        console.log(error);
        res.status(500).send("Error while adding product!");
    }
}


async function getAllProducts(req, res){
    try{
        const product = await Product.find({});
        return res.status(200).json(product);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: "Server Error"});
    }
}


async function getProductWithID(req, res){
    const productId = req.params.psn;
    const product = await products.findOne({PSN: productId});
    if(!product){
        return res.status(404).send("Product Doesn't Exist!");
    }
    try{
        res.status(200).send(product);
    }
    catch(error) {
        console.log(error);
        res.status(500).send("Product Not Found!")
    }
}


module.exports = {}
