import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {User}  from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register=catchAsyncError(async(req,res,next)=>{
     const {name,email,phone ,role,password}=req.body;
     if(!name || !email || !phone || !role || !password)
     {
        return next(new ErrorHandler("Please fill full registration form ."))
     }
     const isEmail = await User.findOne({email})
     if(isEmail){
        return next(new ErrorHandler("Email already exists"))
     }
     const user = await User.findOne({
        name,
        email,
        phone,
        role,
        password,
     })
   //   res.status(200).json({
   //      success: true,
   //      message:"User registered successfully",
   //      user,
   //   })
   sendToken(user,200,res,"User registered successfully")

})