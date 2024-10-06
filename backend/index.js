import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import cors from 'cors'
import dotenv from 'dotenv'

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
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

// Routes setup
app.use('/user', userRouter)
app.use('/finsights', queryRouter)
app.use('/auth', authRouter)


const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
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
