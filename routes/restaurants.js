const express = require( 'express' );
const router = express.Router();
const asyncWrapper = require('../utils/AsyncWrapper');
const ExpressError = require('../utils/ExpressError');
const Restaurant = require('../models/restaurant');
const {restaurantSchema} = require('../schemas.js');

const validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    }
    else{
        next();
    }
}

router.get( '/', async ( req, res ) => {
    const restaurants = await Restaurant.find( {} );
    res.render( 'restaurants/index', { restaurants } );
} )

//must be above id because if not, the route will try to find a restaurant with id of "new"
router.get( '/new', ( req, res ) => {
    res.render( 'restaurants/new' );
} );

router.post( '', validateRestaurant, asyncWrapper( async ( req, res, next ) => {
    const restaurant = new Restaurant( req.body.restaurant );
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant!')
    res.redirect( `/restaurants/${restaurant._id}` );

} ))

router.get( '/:id', asyncWrapper(async ( req, res ) => {
    //Populate will automatically replace the specified path in the document, with document(s) from other collection(s),
    //which is what we need to display its fields, body and rating
    const restaurant = await Restaurant.findById( req.params.id ).populate('reviews');
    res.render( 'restaurants/show', { restaurant, msg: req.flash("success")} );
} ))

router.get( '/:id/edit', asyncWrapper(async ( req, res ) => {
    const restaurant = await Restaurant.findById( req.params.id );
    res.render( 'restaurants/edit', { restaurant } );
} ))

//post request faked as put request
router.put( '/:id', validateRestaurant, asyncWrapper(async ( req, res, next) => {
    const { id } = req.params; 
    const restaurant = await Restaurant.findByIdAndUpdate( id, { ...req.body.restaurant } );
    res.redirect( `/restaurants/${restaurant._id}` );
} ))

router.delete( '/:id', asyncWrapper(async ( req, res ) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete( id);
    req.flash('success', 'Successfully deleted the restaurant!')
    res.redirect( `/restaurants` );
} ))

module.exports = router;