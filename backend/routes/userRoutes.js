// src/routes/userRoutes.js

import express from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import multer from 'multer'
import passport from 'passport'
import sendEmail from '../utils/email.js'

import pool from '../db/conn.js'

dotenv.config()

const router = express.Router()

// 🔴 Removed: Duplicate session and Passport middleware initializations
// router.use(session({
//   secret: process.env.SECRET_KEY,
//   resave: false,
//   saveUninitialized: true
// }))

// router.use(passport.initialize())
// router.use(passport.session())

// 🔴 Removed: Passport serializeUser and deserializeUser functions
// These are now defined in index.js

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Rename the file
  },
});

const upload = multer({ storage });

// 🔄 Updated: Use Passport's req.login to establish session after manual authentication
router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    // Find user
    const [users] = await pool.query('SELECT * FROM user_profile WHERE email = ?', [email]);
    if (users.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }
 
    const user = users[0];

    // Check if password is set (OAuth users may not have a password)
    if (!user.password) {
        return res.status(400).json({ message: 'Please sign in using Google or Facebook.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Initialize session using Passport's req.login
    req.login(user, (err) => { // Changed: using req.login for session establishment
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        res.status(200).json({ message: 'Logged in successfully.' });
    });
} catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Internal server error.' });
}
})

// Auth-Status Route
router.get('/auth-status', (req, res) => {  
  if (req.isAuthenticated()) {
      return res.status(200).json({ isAuthenticated: true, twoFA: req.session.twoFA === true, username: req.user.fullname });
  } else {
      return res.status(200).json({ isAuthenticated: false, user: 'Default user' });
  }
});

// Sign-Out Route
router.get("/sign-out",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect(process.env.FRONTEND_BASE_URL);
    })
})

// Sign-Up Route
router.post('/sign-up', upload.single('photo'), async (req, res) => {
    const { email, password, firstname, lastname, fullname } = req.body;
    const photo_url = req.file ? req.file.path : null

    console.log(req.body)

    if(!email || !password){
      return res.status(400).json({message: "All fields are required"})
    }

    try {
      const [existingUser] = await pool.query('SELECT * FROM user_profile WHERE email = ?', [email])
      if (existingUser.length > 0){
        return res.status(400).json({message: "User with this email already exists"})
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const [result] = await pool.query(
        'INSERT INTO user_profile (email, firstname, lastname, fullname, photo_url, password, provider) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, firstname, lastname, fullname, photo_url, hashedPassword, 'local']
    )
      
      res.status(201).json({ message: 'User registered successfully.' });
    }
    catch(err){
      console.log("Error: ", err)
      res.status(500).json({message: "Internal Server Error"})
    }
})

// Logout Route
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
      });
    });
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if(!email) {
    return res.status(400).json({message: "Email is required"})
  }

  try {
    // Find user
    const [users] = await pool.query('SELECT * FROM user_profile WHERE email = ?', [email]);
    if (users.length === 0) {
        return res.status(400).json({ message: 'No user found with this email.' });
    }

    const user = users[0];

    // Generate a token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration in the database
    const expires = Date.now() + 3600000; // 1 hour from now
    await pool.query(
        'UPDATE user_profile SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?',
        [token, new Date(expires), email]
    );

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password/${token}`;
    const subject = 'Password Reset Request';
    const html = `
        <p>You requested a password reset.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail(email, subject, html);

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
      console.error('Error during password reset request:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }

  // 🔴 Removed: Redundant response
  // res.status(200).json({message: "If an account with that email exists, a reset link has been sent."})
})

// Password Reset Route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
      return res.status(400).json({ message: 'New password is required.' });
  }

  try {
      // Find user with the token and check if token is not expired
      const [users] = await pool.query(
          'SELECT * FROM user_profile WHERE reset_password_token = ? AND reset_password_expires > ?',
          [token, new Date()]
      );

      if (users.length === 0) {
          return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
      }

      const user = users[0];

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and clear reset token fields
      await pool.query(
          'UPDATE user_profile SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
          [hashedPassword, user.id]
      );

      res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
      console.error('Error during password reset:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

// Password Update Route
router.post('/update-password', async (req, res) => {
  if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized.' });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
      const user = req.user;

      // If user registered via OAuth and doesn't have a password
      if (!user.password) {
          return res.status(400).json({ message: 'Cannot update password. Please use OAuth provider to manage your account.' });
      }

      // Compare current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect.' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in the database
      await pool.query(
          'UPDATE user_profile SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
      );

      res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
      console.error('Error during password update:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router
