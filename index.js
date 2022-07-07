const express = require( 'express' );
const app = express();
const path = require( 'path' );
const mongoose = require( 'mongoose' );
var methodOverride = require( 'method-override' )

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


app.set( 'view engine', 'ejs' )
app.set( 'views', path.join( __dirname, 'views' ) )

app.get( '/', ( req, res ) => {
    res.render( 'home' );
} )

app.get( '/restaurants', async ( req, res ) => {
    const restaurants = await Restaurant.find( {} );
    res.render( 'restaurants/index', { restaurants } );
} )

//must be above id because if not, the route will try to find a restaurant with id of "new"
app.get( '/restaurants/new', ( req, res ) => {
    res.render( 'restaurants/new' );
} );

app.post( '/restaurants', async ( req, res ) => {
    const restaurant = new Restaurant( req.body.restaurant );
    await restaurant.save();
    res.redirect( `/restaurants/${restaurant._id}` );
    //res.send( req.body );
} )

app.get( '/restaurants/:id', async ( req, res ) => {
    const restaurant = await Restaurant.findById( req.params.id );
    res.render( 'restaurants/show', { restaurant } );
} )

app.get( '/restaurants/:id/edit', async ( req, res ) => {
    const restaurant = await Restaurant.findById( req.params.id );
    res.render( 'restaurants/edit', { restaurant } );
} )

//post request faked as put request
app.put( '/restaurants/:id', async ( req, res ) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate( id, { ...req.body.restaurant } );
    res.redirect( `/restaurants/${restaurant._id}` );

} )


app.listen( 3000, () => {
    console.log( "working and listening :)" );
} )