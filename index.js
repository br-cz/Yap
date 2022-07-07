const express = require( 'express' );
const app = express();
const path = require( 'path' );
const mongoose = require( 'mongoose' );

const Restaurant = require( './models/restaurant' );

//here yap-restaurant is our temp db
mongoose.connect( 'mongodb://localhost:27017/yap-restaurants' )

//helps verify everything is running smoothly
const db = mongoose.connection; //shorten code
db.on( "error", console.error.bind( console, "connection error!" ) );
db.once( "open", () => {
    console.log( "lets get it started!" );
} )

app.set( 'view engine', 'ejs' )
app.set( 'views', path.join( __dirname, 'views' ) )

app.get( '/', ( req, res ) => {
    res.render( 'home' );
} )

app.get( '/restaurants', async ( req, res ) => {
    const restaurants = await Restaurant.find( {} );
    res.render( 'restaurants/index', { restaurants } );
} )

app.get( '/restaurants/:id', async ( req, res ) => {
    const restaurant = await Restaurant.findById( req.params.id );
    res.render( 'restaurants/show', { restaurant } );
} )

app.listen( 3000, () => {
    console.log( "working and listening :)" );
} )