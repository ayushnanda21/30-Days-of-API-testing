//acquirng router
const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
  } = require("./verifyToken");


  router.get("/test", (req,res)=>{
      res.status(200).json("Start testing")
  })

router.post("/testpost", (req,res)=>{
    if(!req.body.firstName){
        res.status(400).json("You need to pass firstname")
    };
    res.status(201).json("Got")
});

//register user
router.post("/register", async (req,res)=>{

    try{
        //hashing password
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(req.body.passwordHash, salt);

        //create new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: hashedPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        });
    
        //save and response
        const savedUser = await newUser.save();
        res.status(201).json({
            data: savedUser,
            message: "success"
        });
    } catch(err){
        res.status(500).json({
            error: err,
            message: "failed"
        });
    }


});

//login user
router.post("/login", async(req,res)=>{

    try{
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(req.body.passwordHash , user.passwordHash);
        !validPassword && res.status(400).json("Wrong password");
        
        //jwt
        const accessToken  = jwt.sign({
                id : user._id,
                isAdmin : user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn: "1d"}
        );

        //Destructuring of objects
        const {passwordHash, updatedAt,  ...others} = user._doc;

        //if everything verified
        res.status(200).json({
            ...others ,accessToken,
            message: "Success"
        });
    } catch(err){
        res.status(500).json(err);
    }
    
});

router.get("/k", (req,res)=>{
    res.status(200).json("working");
});

//get user by id
router.get("/:id",verifyTokenAndAdmin, async (req,res)=>{

    const user = await User.findById(req.params.id);
    const {passwordHash , updatedAt,  ...other} = user._doc;

    try{
        if(!user){
            res.status(404).json({
                success: false,
                message : "User not found with this id!"
            });
        } else{
            res.status(200).json(other);
        }
    } catch(err){
        res.status(500).json(err);
    }
});


//get all users
router.get("/", verifyTokenAndAdmin,async(req,res)=>{

    try{
        const userList = await User.find().select('-passwordHash');
        if(!userList){
            res.status(404).json({
                success: false,
                message : "user list doesn't exist"
            });
        } else{
            res.status(200).json(userList)
        }
    } catch(err){
        res.status(500).json(err);
    }
});



//delete user
router.delete("/:id",verifyTokenAndAuthorization, async(req,res)=>{

    try{
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if(!deleteUser){
            res.status(400).json({
                success: false,
                message: "User id doesn't exist"
            });
        } else{
            res.status(200).json({
                success: true,
                message: "User successfully deleted!"
            });
        }
    } catch(err){
        res.status(500).json(err);
    }

});

//update user
router.put("/:id" ,verifyTokenAndAuthorization,async(req,res)=>{

    //if user wants to update password
    //if tries to modify password
    if(req.body.passwordHash){
        try{    
            const salt = await bcrypt.genSalt(10);
            req.body.passwordHash = await bcrypt.hash(req.body.passwordHash, salt);
        } catch(err){
                return res.status(500).json(err);
        }
    }
    //updating other details of user
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new : true}
        );
        if(!updatedUser){
            res.status(400).json("User not found");
        } else{
            res.status(200).json(updatedUser);
        }
        
    } catch(err){
        res.status(500).json(err)
    }


});

//count of users
router.get("/get/count",verifyTokenAndAdmin, async (req,res) =>{

    try{
        const userCount  = await User.countDocuments();
        if(!userCount){
            res.status(400).json({
                success: false,
                message: "Count error!"
            });
        } else{
            res.status(200).json("User count is : " + userCount);
        }
    }catch(err){
        res.status(500).json({
            error: err,
            success: false
        })
    }
});





module.exports = router