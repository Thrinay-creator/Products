const bcrypt=require("bcryptjs");
const User = require("../models/User");
const makeToken=require("../utils/makeToken")
const jwt=require("jsonwebtoken");
exports.register=async(req,res,next)=> {
    try{
            const{name,email,password,confirmPassword}=req.body;
    if(!name){
        return res.status(404).json({
            message: "name not found"
        })
    }
    if(!email){
        return res.status(404).json({
            message: "email not found"
        })
    }
    if(!password || !confirmPassword){
        return res.status(404).json({
            message: "enter password or confirm password"
        })
    }
    if(password != confirmPassword){
        return res.status(404).json({
            message:"password and confirm password is not same"
        })
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await User.create({
            name,
            email,
            password:hashedPassword
    })
    return res.status(201).json({
        id:user._id,
        name:user.name,
        email:user.email
    })
    }
    catch(err){
        next(err);
    }
}


exports.login=async(req,res,next)=>{
    try{
        const{email,password}=req.body;
        if(!email){
            return res.status(401).json({
                messsage:"Email not found"
            })
        }
         if(!password){
            return res.status(401).json({
                messsage:"Password not found"
            })
        }
        const user=await User.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({
                message:"User doesnt exist"
            })
        }
       const ok= await bcrypt.compare(password,user.password);
        if(!password){
            return res.status(401).json({
                message:"Enter correct password"
            })
        }
        res.status(200).json({
            token:makeToken(user)
        })

    }
    catch(err){
        next(err)
    }
}
