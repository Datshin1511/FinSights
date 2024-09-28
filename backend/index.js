import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from 'passport'
import pg from 'passport-google-oauth2'
import cors from 'cors'

import pool from './db/conn.js'

dotenv.config()

const app = express()
const OAuth2Strategy = pg.Strategy;
const PORT = process.env.PORT || 3000

// EXPRESS UTILITIES

app.use(cors({
    origin: `http://localhost:${process.env.PORT}`,
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}))

app.use(express.json())

app.use(session({
    secret: process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true
}))

app.use(passport.initialize())

app.use(passport.session())

passport.use(
    new OAuth2Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile","email"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        try {
            console.log("Profile details: ", profile)
            
            // Sample MySQL connection check check
            const [rows] = await pool.query('SELECT * FROM companies')

            console.log(rows)

            return done(null, rows)

        } catch (error) {
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.deserializeUser((user, done)=>{
    done(null, user)
})

// ROUTES

app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:3000/dashboard",
    failureRedirect:"http://localhost:3000/login"
}))

app.get("/login/sucess",async(req,res)=>{

    if(req.user){
        res.status(200).json({message:"User Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:3000");
    })
})

// LISTENING

app.listen(PORT, ()=>{
    console.log("The application is listening on port:", PORT)
})