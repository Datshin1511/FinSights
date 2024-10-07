// index.js

import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import cors from 'cors'
import dotenv from 'dotenv'

import pool from './db/conn.js' // 🔴 Added: Importing pool for serialization
import userRouter from './routes/userRoutes.js'
import queryRouter from './routes/queryRoutes.js'
import authRouter from './routes/authenticationRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware setup
app.use(cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}));

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // 🔄 Changed: Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}))

app.use(passport.initialize())
app.use(passport.session())

// 🔄 Moved: Passport Serialization
passport.serializeUser((user, done) => {
    done(null, user.id); // Changed: serialize by user.id
});

// 🔄 Moved: Passport Deserialization
passport.deserializeUser(async (id, done) => {
    try {
        const [users] = await pool.query('SELECT * FROM user_profile WHERE id = ?', [id]);
        if (users.length > 0) {
            done(null, users[0]); // Attach user to req.user
        } else {
            done(new Error('User not found'), null);
        }
    } catch (err) {
        done(err, null);
    }
});

// Routes setup
app.use('/user', userRouter)
app.use('/finsights', queryRouter)
app.use('/auth', authRouter)

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.session.twoFA === true) {
        return next();
    } else if (req.isAuthenticated() && req.session.twoFA !== true) {
        res.redirect(`${process.env.FRONTEND_BASE_URL}/2fa`)
    } else {
        res.redirect(`${process.env.FRONTEND_BASE_URL}/login`);
    }
};

// Authorization of pages
app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.send('Welcome to the dashboard!');
});

app.get('/history', ensureAuthenticated, (req, res) => {
    res.send('Your history insights!');
});

// Listening on desired PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
