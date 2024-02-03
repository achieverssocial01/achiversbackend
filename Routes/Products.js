import express from "express";
import multer from "multer";
import { addproducts, getallproducts, getsingleproduct } from "../Controllers/products.js";
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const ProductRoute = express.Router();

ProductRoute.post("/addproduct",upload.single("image"),addproducts)
ProductRoute.get("/allproduct",getallproducts)
ProductRoute.get("/singleproduct/:id",getsingleproduct)

export {ProductRoute}