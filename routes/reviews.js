const express = require( 'express' );
//mergeParams allows us to get access to the campground ID, since we get no access to it by default
//as routers like to keep their params separate
const router = express.Router( { mergeParams: true } );
const asyncWrapper = require( '../utils/AsyncWrapper' );
const ExpressError = require( '../utils/ExpressError' );

const { reviewSchema } = require( '../schemas.js' );
const Restaurant = require( '../models/restaurant' );
const Review = require( '../models/review' );

const reviewController = require( '../controllers/reviews' );

const { isLoggedIn, isReviewAuthor, validateReview } = require( '../middleware.js' )

router.post( '/', isLoggedIn, validateReview, asyncWrapper( reviewController.createReview ) );

//Need reviewId to remove the reference of the review in the restaurant and the review itself
router.delete( '/:reviewId', isLoggedIn, isReviewAuthor, asyncWrapper( reviewController.deleteReview ) );

module.exports = router;