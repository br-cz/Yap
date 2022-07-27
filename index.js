const express = require( 'express' );
const app = express();
const path = require( 'path' );
const mongoose = require( 'mongoose' );
const methodOverride = require( 'method-override' );
const ejsMate = require( 'ejs-mate' );
const asyncWrapper = require('./utils/AsyncWrapper');
const ExpressError = require('./utils/ExpressError');
const {restaurantSchema, reviewSchema} = require('./schemas.js');
const Restaurant = require('./models/restaurant');
const Review = require('./models/review');

const restaurants = require('./routes/restaurants');

// override with POST having ?_method=PUT
app.use( methodOverride( '_method' ) )

//here yap-restaurant is our temp db
mongoose.connect( 'mongodb://localhost:27017/yap-restaurants' )

//helps verify everything is running smoothly
const db = mongoose.connection; //shorten code
db.on( "error", console.error.bind( console, "connection error!" ) );
db.once( "open", () => {
    console.log( "lets get it started!" );
} )

//to make sure res.body is not empty
app.use( express.urlencoded( { extended: true } ) );

app.use( express.static( "public" ) );

app.engine( 'ejs', ejsMate );
app.set( 'view engine', 'ejs' )
app.set( 'views', path.join( __dirname, 'views' ) )


//can make this method modular
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    }
    else{
        next();
    }
}

app.use('/restaurants', restaurants)

app.get( '/', ( req, res ) => {
    res.render( 'home' );
} )

app.get( '/error', ( req, res ) => {
    res.render( 'error' );
} )



app.post('/restaurants/:id/reviews', validateReview, asyncWrapper(async(req,res) =>{
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    //we can do this in parallel 
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
}))

//Need reviewId to remove the reference of the review in the restaurant and the review itself
app.delete('/restaurants/:id/reviews/:reviewId', asyncWrapper(async(req,res) =>{
    const {id, reviewId} = req.params;

    await Restaurant.findByIdAndUpdate(id, { $pull: {reviews: reviewId}} );

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/restaurants/${id}`);
}))

//'*' means for every path
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    //Default code and message are arbitrary
    const {statusCode = 500} = err;

    if(!err.message) err.message = 'Oops Error!';

    res.status(statusCode).render('error', { err });
})

app.listen( 3000, () => {
    console.log( "working and listening :)" );
} )