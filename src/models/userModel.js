

import mongoose from "mongoose";



const userSchema=new mongoose.Schema({

    userName:{
        type:String,
        unique:true,
        trim:true,
        required:[true,'Please provide a username'],
        minlength:[3,'Username must be at least 3 characters'],
    },

    email:{
        type:String,
        unique:true,
        required:[true,'Please provide an email'],
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Please provide a valid email address'],
    },

    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:[6,'Password must be at least 6 characters'],
    },

    isVarified:{
        type:Boolean,
        default:false,
    },

    isAdmin:{
        type:Boolean,
        default:false,
    },

    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
    varifyToken:String,
    varifyTokenExpiry:Date,


})


const User=mongoose.models.User||mongoose.model('User',userSchema);

export default User;