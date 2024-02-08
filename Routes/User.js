import express from "express";
import {resetpassword, userregister,usersignin, userupdate, getuserinfobyreferalid, Buycourse,  UserCourseStatus, admingetbystatus, getuserpaymentstatus, getMyReferalsInfo, getMyInvoiceInfo, gettotalincome, gettodayincome, getIncomeForDateRange, getMonthlyIncome } from "../Controllers/User.js";
const userRoute = express.Router();

userRoute.post("/register",userregister)
userRoute.post("/login",usersignin)
userRoute.post("/updateuser",userupdate)
userRoute.post("/resetpassword",resetpassword)
userRoute.post("/buycourse",Buycourse)
userRoute.post("/admin/payment/verify",UserCourseStatus)
userRoute.post("/getUserByReferalId", getuserinfobyreferalid)
userRoute.get("/getadmindata",admingetbystatus);
userRoute.post("/getuserpaymentstatus",getuserpaymentstatus);
userRoute.get("/getMyReferalsInfo/:referalId",getMyReferalsInfo);
userRoute.get("/getMyInvoiceInfo/:userId",getMyInvoiceInfo);
userRoute.get("/totalincome/:userId",gettotalincome)
userRoute.get("/todayincome/:userid",gettodayincome)
userRoute.get("/getweeklyincome/:userid",getIncomeForDateRange)
userRoute.get("/getmonthlyincome/:userid",getMonthlyIncome)
export {userRoute}