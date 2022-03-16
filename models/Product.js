const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
     name:{
         type: String,
          required: true,
          max: 50
     },
     image:{
         type: String,
         default: ""
     },
     countInStock:{
         type: Number
     },
}
);

module.exports = mongoose.model("Product", productSchema);