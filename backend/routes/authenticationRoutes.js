import express from 'express'
import passport from 'passport'
import google from 'passport-google-oauth2'
import facebook from 'passport-facebook'
import pool from '../db/conn.js'

const router = express.Router()

const GoogleStrategy = google.Strategy;
const FacebookStrategy = facebook.Strategy;

router.use(passport.initialize())
router.use(passport.session())

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
            console.log("Existing user found!");
        } else {
            const [result] = await pool.query("INSERT INTO user_profile(user_id, provider, firstname, lastname, fullname, email, photo_url) VALUES(?, ?, ?, ?, ?, ?, ?)", [
                profile.id,
                profile.provider,
                profile.given_name,
                profile.family_name,
                profile.given_name + " " + profile.family_name,
                profile.email,
                profile.picture
            ]);
            user = {
                id: result.insertId,
                facebook_id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profile_picture: profile.photos[0].value,
                media: profile.provider
            };
            console.log("New user created: ");
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
            console.log("Existing user found!");
        } else {
            const [result] = await pool.query("INSERT INTO user_profile(user_id, provider, firstname, lastname, fullname, email, photo_url) VALUES(?, ?, ?, ?, ?, ?, ?)", [
                profile.id,
                profile.provider,
                profile.name.givenName ? profile.name.givenName : '',
                profile.name.familyName ? profile.name.familyName : '',
                profile.displayName,
                profile.emails ? profile.emails[0].value : '',
                profile.photos ? profile.photos[0].value : ''
            ]);
            user = {
                id: result.insertId,
                facebook_id: profile.id,
                name: profile.displayName,
                email: profile.emails ? profile.emails[0].value : '',
                profile_picture: profile.photos ? profile.photos[0].value : '',
                media: profile.provider
            };
            console.log("New user created: ");
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

// Google authentication routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: `${process.env.FRONTEND_BASE_URL}/dashboard`,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/login`
}));

// Facebook authentication routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: `${process.env.FRONTEND_BASE_URL}/dashboard`,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/login`
}));

export default router;