import mongoose from "mongoose";
const TransactionSchema = new mongoose.Schema({
    transactionid:{
        type:String,
        required:true, 
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userCollection",
        required:true,
    },
    referaluserid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userCollection",
    },
    status:{
        type:String,
        required:true,
        default:"pending"
    },
    productid:{
    },
    courseid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"productCollection",
    },
    complementry:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"productCollection",
    },
},{timestamps:true})



const Transaction= mongoose.model("Transaction",TransactionSchema)
export {Transaction}