require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoute = require("./routes/product");

const app = express();

const api = process.env.API_URL
//http://localhost:5000/api/v1/products

//middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use("/api/v1/products", productRoute);

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