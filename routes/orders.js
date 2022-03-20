//acquirng router
const router = require("express").Router();
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
  } = require("./verifyToken");

//importing order model
const Order = require("../models/Order");
const OrderItem = require("../models/Order-Item");

//creating order

router.post("/", async(req,res)=>{

  const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
    let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product
    })

    newOrderItem = await newOrderItem.save();

    return newOrderItem._id;
}))
const orderItemsIdsResolved =  await orderItemsIds;

  const newOrder =  new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user
  });

  try{
      const savedOrder = await newOrder.save();
      if(!savedOrder){
          return res.status(400).json("Order can't be created");
      }
      res.status(201).json(savedOrder);
  } catch(err){
      res.status(500).json({
          error: err,
          success: false
      });
  }

});






module.exports = router