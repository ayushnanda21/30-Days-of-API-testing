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

//getting all orders
router.get("/", verifyTokenAndAdmin,  async (req,res)=>{

  try{
    const orderList = await Order.find().populate('user' ,'name');
    if(!orderList){
      res.status(400).json("Orders doesn't exist");
    } else{
      res.status(200).json(orderList);
    }
  } catch(err){
    res.statusMessage(500).json(err);
  }
  

})

//getting particular order 
router.get("/:id", async(req,res)=>{

  try{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({path: 'orderItems', populate: 'product'});

    if(!order){
      res.status(400).json("Order not found");
    } else{
      res.status(200).json(order);
    }
  } catch(err){
    res.status(500).json(err);
  }

});

// update status of order
router.post("/:id" , async (req,res)=>{

  try{
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, 
      {
        $set: req.body,
      },
    {new : true}
    );
    if(!updatedOrder){
      res.status(400).json("Order not found");
  } else{
      res.status(200).json(updatedOrder);
  }
  } catch(err){
    res.status(500).json(err);
  }

});

//delete order
router.delete("/:id", verifyTokenAndAdmin ,async (req,res)=>{

  try{
      const order = await Order.findByIdAndRemove(req.params.id);
        if(order){
          await order.orderItems.map(async orderItem=>{
            await OrderItem.findByIdAndRemove(orderItem)
          })
          res.status(200).json({
            success: true,
            message: "Order has been deleted"
          });
        }
        else{
            res.status(500).json({
              success: false,
              message: "Order not deleted...err"
            });
        }         
  } catch(err){
      res.status(500).json(err);
  }

});







module.exports = router