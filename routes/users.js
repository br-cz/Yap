const express = require( 'express' );
const router = express.Router();
const User = require('../models/user');

const asyncWrapper = require('../utils/asyncWrapper')
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

module.exports = router;