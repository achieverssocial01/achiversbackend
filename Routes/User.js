import express from "express";
import {resetpassword, userregister,usersignin } from "../Controllers/User.js";
const userRoute = express.Router();

userRoute.post("/register",userregister)
userRoute.post("/login",usersignin)
userRoute.post("/resetpassword",resetpassword)
export {userRoute}