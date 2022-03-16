//acquiring model
const { rawListeners } = require("../models/Product");
const Product = require("../models/Product");

//acquirng router
const router = require("express").Router();


module.exports = router

router.post("/", async(req,res)=>{

    const newProduct = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });

    try{
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch(err){
        res.status(500).json({
            error: err,
            success: false
        });
    }

});

router.get("/", async(req,res)=>{
    const productList = await Product.find();
    res.send(productList);
});