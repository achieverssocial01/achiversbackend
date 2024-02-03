import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

    name: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true
    },
     email:{
    type:String,
     required:true
   },
    password:{
    type:String,
    required:true
   },
    referal:{
    type:String
   },
   referalID:{
    type:String,
    required:true
   },
   referalpoint:{
    type:Number,
    default:0,
   }
})

const userCollection= mongoose.model("userCollection",userSchema)
export {userCollection}