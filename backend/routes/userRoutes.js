import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.post('/sign-in', (req, res) => {
    console.log(req.body)

    res.status(200).json({
        "message": "Login form was posted!",
        "Request body": req.body
    })
})

router.get('/auth-status', (req, res) => {
  if (req.isAuthenticated()) {
      console.log(req.user)
      return res.status(200).json({ isAuthenticated: true, username: req.user.fullname });
  } else {
      return res.status(200).json({ isAuthenticated: false, user: '' });
  }
});

router.get("/sign-out",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect(process.env.FRONTEND_BASE_URL);
    })
})

router.post('/sign-up', (req, res) => {
    console.log(req.body)

    res.status(200).json({
        "message": "Register form was posted!",
        "Request body": req.body
    })
})

router.post('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send({ message: 'Error logging out' });
      }
      req.session.destroy(() => {
        res.clearCookie('connect.sid'); // Clear session cookie
        res.status(200).send({ message: 'Logged out successfully' });
      });
    });
  });
  


export default router