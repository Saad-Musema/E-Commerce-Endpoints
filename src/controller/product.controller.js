const Product = require("../model/product.mongo")

async function addProduct(req, res){

    const product = new Product(req.body);


    if(await Product.findOne({PSN: product.PSN})){
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
    
    try{
        const productId = req.params.psn;
        console.log(productId)
        const product = await Product.findOne({PSN: productId});
        if(!product){
        return res.status(404).send("Product Doesn't Exist!");
        }
        res.status(200).send(product);
    }
    catch(error) {
        console.log(error);
        res.status(500).send("Product Not Found!")
    }
}


async function deleteProduct(req, res){
    try{
        const productId = req.params.psn;
        const result = await Product.deleteOne({PSN: productId});
        if(result.deletedCount === 0){
            return res.status(404).send("Product Doesn't Exist!");
        }
        res.status(200).send("Product Deleted Successfully!");
    }catch(error) {
        console.log(error);
        res.status(500).send("Internal Server Error!")
    }
}


async function updateProduct(req, res){
    try{
        const productId = req.params.psn;
        const updateData = req.body;

        // Log the incoming data for debugging
        console.log(`Updating product with PSN: ${productId}`);
        console.log('Update data:', updateData);

        // Validate that updateData is not empty
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).send("No update data provided");
        }

        const product = await Product.findOneAndUpdate({ PSN: productId }, updateData, { new: true, runValidators: true });

        // Log the result of the update operation
        console.log('Update result:', product);

        if (!product) {
            return res.status(404).send("Product Doesn't Exist or No Changes Made!");
        }
        res.status(200).send("Product Updated Successfully!");
    }catch(error) {
        console.log('Error updating product:', error.message);
        res.status(500).send("Internal Server Error!");
    }
}


module.exports = { 
    addProduct,
    getAllProducts,
    getProductWithID,
    deleteProduct,
    updateProduct}
