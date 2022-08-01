const express = require( 'express' );
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

const asyncWrapper = require('../utils/asyncWrapper');

const userController = require('../controllers/users');

router.get('/register', userController.renderRegister);

router.post('/register', asyncWrapper(userController.register));

router.get('/login', userController.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), userController.login);

router.get('/logout', userController.logout)

// router.post('/logout', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
//     req.flash('success', 'Nice to see you again!');
//     res.redirect('/restaurants');
// });

module.exports = router;