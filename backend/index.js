import express from 'express'
import session from 'express-session'
import passport from 'passport'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import pool from './db/conn.js'
import userRouter from './routes/userRoutes.js'
import queryRouter from './routes/queryRoutes.js'
import google from 'passport-google-oauth2'
import facebook from 'passport-facebook'

dotenv.config()

const app = express()
const GoogleStrategy = google.Strategy;
const FacebookStrategy = facebook.Strategy;
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

// Passport Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const [rows] = await pool.query("SELECT * FROM user_profile WHERE user_id = ?", [profile.id]);
        let user;
        if (rows.length > 0) {
            user = rows[0];
            console.log("Existing user found!", user);
        } else {
            const [result] = await pool.query("INSERT INTO user_profile(user_id, provider, firstname, lastname, email, photo_url) VALUES(?, ?, ?, ?, ?, ?)", [
                profile.id,
                profile.provider,
                profile.given_name,
                profile.family_name,
                profile.email,
                profile.picture
            ]);
            user = {
                id: result.insertId,
                google_id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profile_picture: profile.photos[0].value
            };
            console.log("New user created: ", user);
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Passport Facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [rows] = await pool.query("SELECT * FROM user_profile WHERE user_id = ?", [profile.id]);
        let user;
        if (rows.length > 0) {
            user = rows[0];
            console.log("Existing user found!", user);
        } else {
            const [result] = await pool.query("INSERT INTO user_profile(user_id, provider, firstname, lastname, email, photo_url) VALUES(?, ?, ?, ?, ?, ?)", [
                profile.id,
                profile.provider,
                profile.name.givenName,
                profile.name.familyName,
                profile.emails ? profile.emails[0].value : '',
                profile.photos ? profile.photos[0].value : ''
            ]);
            user = {
                id: result.insertId,
                facebook_id: profile.id,
                name: profile.displayName,
                email: profile.emails ? profile.emails[0].value : '',
                profile_picture: profile.photos ? profile.photos[0].value : ''
            };
            console.log("New user created: ", user);
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Auth status route
app.get('/user/auth-status', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
        return res.status(200).json({ isAuthenticated: false });
    }
});

// Login and logout routes
app.post('/user/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).send('Logged out');
    });
});

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: `${process.env.FRONTEND_BASE_URL}/dashboard`,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/login`
}));

// Facebook authentication routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: `${process.env.FRONTEND_BASE_URL}/dashboard`,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/login`
}));

// Protect dashboard and history routes
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect(`${process.env.FRONTEND_BASE_URL}/login`);
    }
};

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.send('Welcome to the dashboard!');
});

app.get('/history', ensureAuthenticated, (req, res) => {
    res.send('Your history insights!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
