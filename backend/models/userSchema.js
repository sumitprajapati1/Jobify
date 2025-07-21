import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3, "name must contain atleast three letter"],
        maxLength:[30,"name cannot exceed 30 characters"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"please enter a valid email"]
    },
    phone:{
        type:Number,
        required:[true,"please enter a valid phone number"]
    },
    password:{
        type:String,
        required:[true,"please enter a valid password"],
        minLength:[8, "name must contain atleast 8 letters"],
        maxLength:[32,"name cannot exceed 32 characters"]
    },
    role:{
        type:String,
        required:[true,"please enter a valid role"],
        enum:["job Seeker","Employer"]
    },
    createdAt:{
        type:Date,
        default:Date.now,

    }
})

//hashing the  password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10);
})

//comparing the password
userSchema.methods.comparePassword =async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}  

// generating the jwt token for authorization
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

export const User = mongoose.model("User",userSchema);