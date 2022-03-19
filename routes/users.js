//acquirng router
const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//register user
router.post("/register", async (req,res)=>{

    try{
        //hashing password
        const salt = await bcrypt.genSalt(10);
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
        res.status(201).json(savedUser);
    } catch(err){
        res.status(500).json(err);
    }


});

//login user
router.post("/login", async(req,res)=>{

    try{
        const user = await User.findOne({email: req.body.email});
        !user && res.status(401).json("User not found");

        const validPassword = await bcrypt.compare(req.body.passwordHash , user.passwordHash);
        !validPassword && res.status(400).json("Wrong password");
        
        //jwt
        const accessToken  = jwt.sign({
                id : user._id
            },
            process.env.JWT_SEC,
            {expiresIn: "1d"}
        );

        const {passwordHash, updatedAt,  ...others} = user._doc;

        //if everything verified
        res.status(200).json({...others ,accessToken});
    } catch(err){
        res.status(500).json(err);
    }
    
});


//get user by id
router.get("/:id", async (req,res)=>{

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
router.get("/", async(req,res)=>{

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
router.delete("/:id", async(req,res)=>{

    try{
        const deleteUser = User.findByIdAndDelete(req.params.id);
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



module.exports = router