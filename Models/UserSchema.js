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
     required:true,
     unique:true
   },
     gender:{
    type:String,
   },
     state:{
    type:String,
   },
     city:{
    type:String,
   },
     pincode:{
    type:Number,
   },
    address:{
    type:String,
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
   },
   products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"productCollection"
        }
   ],
   status:{
    type:String,
    default:"pending"
   },

   referuser:[]
})



const userCollection= mongoose.model("userCollection",userSchema)
export {userCollection}