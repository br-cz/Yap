const express = require( 'express' );
const router = express.Router();
const asyncWrapper = require('../utils/AsyncWrapper');
const Restaurant = require('../models/restaurant');
const {isLoggedIn, validateRestaurant, isAuthor} = require('../middleware.js');

router.get( '/', async ( req, res ) => {
    const restaurants = await Restaurant.find( {} );
    res.render( 'restaurants/index', { restaurants } );
} )

//must be above id because if not, the route will try to find a restaurant with id of "new"
router.get( '/new', isLoggedIn, ( req, res ) => {
    res.render( 'restaurants/new' );
} );

router.post( '/', isLoggedIn, validateRestaurant, asyncWrapper( async ( req, res, next ) => {
    const restaurant = new Restaurant( req.body.restaurant );
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant!')
    res.redirect( `/restaurants/${restaurant._id}` );

} ))

//SHOW PAGE
router.get( '/:id', asyncWrapper(async ( req, res ) => {
    //Populate will automatically replace the specified path in the document, with document(s) from other collection(s),
    //which is what we need to display its fields, body and rating
    const restaurant = await Restaurant.findById( req.params.id ).populate({
        //Used to find out who posted which review
        path: 'reviews',
        populate: {
            path: 'author' //adds the author of a particular review, we can also just add the username instead of author
        }
    }).populate('author');
    if(!restaurant){
        req.flash('error', 'Restaurant not found!');
        return res.redirect('/restaurants');
    }
    res.render( 'restaurants/show', { restaurant, msg: req.flash("success")} );
} ))

//EDIT PAGE
router.get( '/:id/edit', isLoggedIn, isAuthor, asyncWrapper(async ( req, res ) => {
    const restaurant = await Restaurant.findById( req.params.id );
    if(!restaurant){
        req.flash('error', 'Restaurant not found!');
        return res.redirect('/restaurants');
    }
    res.render( 'restaurants/edit', { restaurant } );
} ))

//post request faked as put request
router.put( '/:id', isLoggedIn, isAuthor, validateRestaurant, asyncWrapper(async ( req, res, next) => {
    const { id } = req.params; 
    const restaurant = await Restaurant.findByIdAndUpdate( id, { ...req.body.restaurant } );
    req.flash('success', 'Successfully updated the restaurant!')
    res.redirect( `/restaurants/${id}` );
} ))

router.delete( '/:id', isLoggedIn, isAuthor, asyncWrapper(async ( req, res ) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the restaurant!')
    res.redirect( `/restaurants` );
} ))

module.exports = router;