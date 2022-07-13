const express = require( 'express' );
const app = express();
const path = require( 'path' );
const mongoose = require( 'mongoose' );
const methodOverride = require( 'method-override' );
const ejsMate = require( 'ejs-mate' );
const asyncWrapper = require('./utils/AsyncWrapper');
const ExpressError = require('./utils/ExpressError');

// override with POST having ?_method=PUT
app.use( methodOverride( '_method' ) )

const Restaurant = require( './models/restaurant' );

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

app.get( '/', ( req, res ) => {
    res.render( 'home' );
} )

app.get( '/error', ( req, res ) => {
    res.render( 'error' );
} )

app.get( '/restaurants', async ( req, res ) => {
    const restaurants = await Restaurant.find( {} );
    res.render( 'restaurants/index', { restaurants } );
} )

//must be above id because if not, the route will try to find a restaurant with id of "new"
app.get( '/restaurants/new', ( req, res ) => {
    res.render( 'restaurants/new' );
} );

app.post( '/restaurants', asyncWrapper( async ( req, res, next ) => {
    const restaurant = new Restaurant( req.body.restaurant );
    await restaurant.save();
    res.redirect( `/restaurants/${restaurant._id}` );
    //res.send( req.body );
} ))

app.get( '/restaurants/:id', asyncWrapper(async ( req, res ) => {
    const restaurant = await Restaurant.findById( req.params.id );
    res.render( 'restaurants/show', { restaurant } );
} ))

app.get( '/restaurants/:id/edit', asyncWrapper(async ( req, res ) => {
    const restaurant = await Restaurant.findById( req.params.id );
    res.render( 'restaurants/edit', { restaurant } );
} ))

//post request faked as put request
app.put( '/restaurants/:id', asyncWrapper(async ( req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate( id, { ...req.body.restaurant } );
    res.redirect( `/restaurants/${restaurant._id}` );
} ))

app.delete( '/restaurants/:id', asyncWrapper(async ( req, res ) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete( id, { ...req.body.restaurant } );
    res.redirect( `/restaurants` );
} ))

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