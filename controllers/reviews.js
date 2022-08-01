const Restaurant = require('../models/restaurant');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    restaurant.reviews.push(review);
    //we can do this in parallel 
    await review.save();
    await restaurant.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/restaurants/${restaurant._id}`);
}

//Need reviewId to remove the reference of the review in the restaurant and the review itself
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/restaurants/${id}`);
}