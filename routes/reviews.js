const express = require( 'express' );
//mergeParams allows us to get access to the campground ID, since we get no access to it by default
//as routers like to keep their params separate
const router = express.Router({mergeParams: true}); 
const asyncWrapper = require('../utils/AsyncWrapper');
const ExpressError = require('../utils/ExpressError');

const {reviewSchema} = require('../schemas.js');
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');

const {validateReview} = require('../middleware.js')

router.post('/', validateReview, asyncWrapper(async(req,res) =>{
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    //we can do this in parallel 
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
}))

//Need reviewId to remove the reference of the review in the restaurant and the review itself
router.delete('/:reviewId', asyncWrapper(async(req,res) =>{
    const {id, reviewId} = req.params;

    await Restaurant.findByIdAndUpdate(id, { $pull: {reviews: reviewId}} );

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/restaurants/${id}`);
}))

module.exports = router;