//acquirng router
const router = require("express").Router();

//acquiring tokens
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require("./verifyToken");

//acquiring packages
const express = require('express');
const fs = require('fs');
const multer = require("multer");
const bodyParser = require("body-parser")
const mongoose  =require("mongoose");
const path = require("path");
const excelToJson = require("convert-excel-to-json");

//models import
const Products = require("../models/Product");
const Users = require("../models/User");

// multer storage
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{  
        cb(null, './public/uploads');  
    },  
    filename:(req,file,cb)=>{  
        cb(null, file.originalname);  
    }  
});

const upload = multer({storage : storage})

//routes for uploading
//upload excel file
router.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
    importExcelData2MongoDB(__dirname  + '/public/uploads' + req.file.filename);
    res.status(200).json({
        'msg': 'File imported to database successfully',
        'file': req.file
    });

});

// Import Excel File to MongoDB database
function importExcelData2MongoDB(filePath){
    // -> Read Excel File to Json Data
    const excelData = excelToJson({
    sourceFile: filePath,
    sheets:[{
    // Excel Sheet Name
    name: 'Sheet1',
    // Header Row -> be skipped and will not be present at our result object.
    header:{
    rows: 1
    },
    // Mapping columns to keys
    columnToKey: {
    A: 'name',
    B: 'description',
    C: 'richDescription',
    D: 'image',
    E: 'images',
    F: 'brand',
    G: 'price',
    H: 'category',
    I: 'countInStock',
    J: 'rating',
    K: 'numReviews',
    L:'isFeatured',
    M: 'createdAt',
    N: 'updatedAt'
    }

    }]
});
    // -> Log Excel Data to Console
    console.log(filePath)
    console.log(excelData);

// //Insert jsonobject to mongodb
Products.insertMany(excelData.Sheet1 , (err, res)=>{
    if(err){
        console.log(err);
    }

    console.log("Inserted Successfully");
});


}

module.exports  =  router