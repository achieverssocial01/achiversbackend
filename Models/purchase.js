import mongoose from "mongoose";
const purchaseSchema = new mongoose.Schema({

userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userCollection"
},
productid:{
    type:mongoose.Schema.Types.ObjectId ,
    ref:"productCollection"
},
referuser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userCollection" 
}
})

const purchaseCollection= mongoose.model("purchaseCollection",purchaseSchema)
export {purchaseCollection}