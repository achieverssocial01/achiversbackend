import crypto from "crypto"
import { uploadFile } from "../middleware/S3.js";
import { productCollection } from "../Models/productSchema.js";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");


const addproducts =async(req,res)=>{
    const {title,price,description} =req.body;
    const file =req.file;
    if(!title || !price){
        return res.status(400).send({msg:"pls enter all details"})
    }
    try {
        const imageName = generateFileName();
        const fileBuffer = file?.buffer
        if(fileBuffer){
            await uploadFile(fileBuffer ,imageName,file.mimetype)
        }
        const data = await productCollection.create({
            title,
            price,
            description,
            img:imageName
        })
        data.imgurl = "https://d1t03wtbg7poo.cloudfront.net/"+data.img
        await data.save();
        res.status(200).send(data)
    } catch (error) {
        return res.status(500).send(error.message)
    }
} 
const getallproducts = async(req,res)=>{
    const data = await productCollection.find({});
    try {
    // for (let product of data) {
    //     product.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + product.img
    //   }
      return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send(error.message) 
    }
}

const getsingleproduct =async (req,res)=>{
    try {
        const id = req.params.id;
    const singleprduct = await productCollection.findById({_id:id})
    return res.status(200).send(singleprduct);

  } catch (error) {
    return res.status(500).send(error.message)
    }
}


export {addproducts,getsingleproduct,getallproducts}