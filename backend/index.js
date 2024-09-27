import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import './db/conn.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: `http://localhost:${process.env.PORT}`,
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}))
app.use(express.json())

mongoose.connect(process.env.DATABASE).then(() => {

   console.log("Database connection succeeded!")
   app.listen(process.env.PORT, ()=>{
    console.log(`Application listening on port: ${process.env.PORT}`)
})


}).catch((err) => {
   console.log("Error: ", err)
})

app.get('/', (req, res)=>{
    res.status(200).json("Server is running..")
})