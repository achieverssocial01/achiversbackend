import mongoose from "mongoose";

const dbUrl = process.env.DB_URL

export const dbConnection = async()=>{
    try {
        await mongoose.connect(dbUrl)
    console.log("Database Connected")
    } catch (error) {
process.exit(1);
    }
}