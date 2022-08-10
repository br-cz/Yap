const express = require( 'express' );
const router = express.Router();
const User = require( '../models/user' );
const passport = require( 'passport' );

const asyncWrapper = require( '../utils/AsyncWrapper' );

const userController = require( '../controllers/users' );

router.route( '/register' )
    .get( userController.renderRegister )
    .post( asyncWrapper( userController.register ) )

router.route( '/login' )
    .get( userController.renderLogin )
    .post( passport.authenticate( 'local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true } ), userController.login )

router.get( '/logout', userController.logout )

module.exports = router;