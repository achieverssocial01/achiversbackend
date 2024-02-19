import mongoose from "mongoose";
const productSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    information:{
        type:String,
        required:true,
        default: 'information'
    },
    price: {
        type:Number,
        required:true
    },
    img:{
        type:String,
    },
    imgurl:{
        type:String,
    },
    courseOverview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"productCollection"
        }
   ],
   content:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"productCollection"
    }
],
   
})
const productCollection= mongoose.model("productCollection",productSchema)
export {productCollection}