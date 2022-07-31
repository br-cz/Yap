const express = require( 'express' );
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

const asyncWrapper = require('../utils/asyncWrapper');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', asyncWrapper( async (req, res) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Welcome to Yap');
    res.redirect('/restaurants');
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Nice to see you again!');
    res.redirect('/restaurants');
});

module.exports = router;