const {restaurantSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Restaurant = require('./models/restaurant')



module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //Used for redirecting back to previous page where user was prompted to login
        req.session.prevUrl = req.originalUrl;
        req.flash('error', 'Not signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params; 
    const restaurant = await Restaurant.findById(id);
    if(!restaurant.author.equals(req.user._id)){
        req.flash('error', 'Missing permission');
        return res.redirect( `/restaurants/${id}` );
    }
    next();
}

//can make modular
module.exports.validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    }
    else{
        next();
    }
}

//can make this method modular
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    }
    else{
        next();
    }
}

