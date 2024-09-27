import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const DB = process.env.DATABASE

mongoose.connect(process.env.DATABASE).then(() => {

    console.log("Database connection succeeded!")

 }).catch((err) => {

    console.log("Error: ", err)
    
 })