const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema; //used to shorten mongoose.Schema types

const reviewSchema = new Schema( {
    body: String,
    rating: Number
} );

//Restaurant becomes restaurants in the mongo collection
module.exports = mongoose.model( 'Review', reviewSchema );