const express = require( 'express' );
const app = express();
const path = require( 'path' );
const mongoose = require( 'mongoose' );

//here yap-restaurant is our temp db
mongoose.connect( 'mongodb://localhost:2701/yap-restaurants', {} )

//helps verify everything is running smoothly
const db = mongoose.connection; //shorten code
db.on( "error", console.error.bind( console, "connection error!" ) );
db.once( "open", () => {
    console.log( "lets get it started!" );
} )

app.set( 'view engine', 'ejs' )
app.set( 'views', path.join( __dirname, 'views' ) )

app.listen( 3000, () => {
    console.log( "working and listening :)" );
} )

app.get( '/', ( req, res ) => {
    res.render( 'home' );
} )