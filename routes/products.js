//acquiring model
const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

//acquirng router
const router = require("express").Router();


module.exports = router

//add new product
router.post("/", async(req,res)=>{

    // to check if this category exist in db or not
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).json("Invalid Category");
    }

    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews : req.body.numReviews,
        isFeatured:req.body.isFeatured,
    });

    try{
        const savedProduct = await newProduct.save();
        if(!savedProduct){
            res.status(404).json({
                status: "false",
                message: "Product can't be created"
            });
        } else{
            res.status(201).json(savedProduct);
        }
        res.status(201).json(savedProduct);
    } catch(err){
        res.status(500).json({
            error: err,
            success: false
        });
    }

});

//update product
router.put("/:id", async (req,res)=>{
    //id validation
    if(mongoose.isValidObjectId(req.params.id)){
        res.status(400).json('Invalid id');
    };
    // to check if this category exist in db or not
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).json("Invalid Category");
    }

    try{
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        {new: true}
        );
    
        if(!updatedProduct){
            res.status(400).json({
                status: false,
                message: "Product doesnt exist"
            });
        } else{
            res.status(200).json(updatedProduct);

        }
    } catch(err){
        res.status(500).json(err);
    }
});


//get all products
router.get("/", async(req,res)=>{
    try{
    const productList = await Product.find().select("name image -_id").populate('category');
    if(!productList){
        res.status(404).json({
            status: false,
            message: "Cant' get all products"
        });
    } else{
        res.status(200).json(productList);
    }
    }catch(err){
    res.status(500).json(err);
    }
});

//get particular product by id
router.get("/:id", async (req,res)=>{

    const product = await Product.findById(req.params.id).populate('category');

    try{
        if(!product){
            res.status(404).json({
                success: false,
                message : "Product you requested doesn't exist"
            });
        } else{
            res.status(200).json(product);
        }
    } catch(err){
        res.status(500).json(err);
    }

});

//delete products
router.delete("/:id", async (req,res)=>{
    try{
        const deletedProduct = await Product.findById(req.params.id);
        if(!deletedProduct){
            res.status(400).json({
                success: false,
                message : "Product doesn't exist"
            });
        } else{
            await deletedProduct.deleteOne();
            res.status(200).json({
                success: true,
                message : "Product successfully deleted"
            });
        }
           
    } catch(err){
        res.status(500).json(err);
    }

});