require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

//acquiring routes
const productRoute = require("./routes/products");
const userRoute = require("./routes/users");
const orderRoute = require("./routes/orders");
const categoriesRoute = require("./routes/categories");
const excelImporRoute =  require("./routes/excelimport");

const app = express();
app.use(cors());
app.options("*", cors());

const api = process.env.API_URL
//http://localhost:5000/api/v1/products

//middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
//app.use(express.static('./public'));
//app.use(authJwt());


app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/categories", categoriesRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/uploading", excelImporRoute);

//connecting db
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true} , function(err){
    if(err){
        console.log(err);
    } else{
        console.log("Database Connected Successfully");
    }
});




//server
app.listen(process.env.PORT || 5000 , (req,res)=>{ 
    console.log(api);
   console.log("Server running on port 5000");
});