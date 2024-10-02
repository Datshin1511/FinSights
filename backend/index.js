import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from 'passport'
import google from 'passport-google-oauth2'
import facebook from 'passport-facebook'
import cors from 'cors'

import pool from './db/conn.js'
import userRouter from './routes/userRoutes.js'
import queryRouter from './routes/queryRoutes.js'

dotenv.config()

const app = express()
const OAuth2Strategy4Google = google.Strategy;
const OAuth2Strategy4Facebook = facebook.Strategy;
const PORT = process.env.PORT || 3000

// EXPRESS UTILITIES

app.use(cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true
}))

app.use(passport.initialize())

app.use(passport.session())

app.use('/user', userRouter)
app.use('/finsights', queryRouter)

// Google passport
passport.use(
    new OAuth2Strategy4Google({
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

// Facebook passport
passport.use(
    new OAuth2Strategy4Facebook({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "/auth/facebook/callback",
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

app.get("/auth/google", passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:`${process.env.FRONTEND_BASE_URL}/dashboard`,
    failureRedirect:`${process.env.FRONTEND_BASE_URL}/login}`
}))

app.get("/auth/facebook", passport.authenticate("facebook",{scope:["profile","email"]}))

app.get("/auth/facebook/callback",passport.authenticate("facebook",{
    successRedirect:`${process.env.FRONTEND_BASE_URL}/dashboard`,
    failureRedirect:`${process.env.FRONTEND_BASE_URL}/login}`
}))

// app.post('/search-company', async (req, res) => {
//     const searchQuery = req.body.search

//     console.log(searchQuery)

//     const sql = `SELECT * FROM companies WHERE name LIKE ?`

//     try{
//         const [rows] = await pool.query(`SELECT * FROM company WHERE name LIKE ?`, [`%${searchQuery}%`]);

//         console.log(rows)

//         if (rows.length > 0) {
//             return res.status(200).json(rows);
//         } 
//         else {
//             return res.status(404).send('No companies found');
//         }
//     }
//     catch(error){
//         console.error(error);
//         return res.status(500).send('Server error');
//     }
// })

// LISTENING

app.listen(PORT, ()=>{
    console.log("The application is listening on port:", PORT)
})