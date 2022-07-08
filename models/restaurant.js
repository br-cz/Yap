const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema; //used to shorten mongoose.Schema types

const RestaurantSchema = new Schema( {
    title: String,
    image: String,
    priceRange: Number,
    description: String,
    location: String
} );

//Restaurant becomes restaurants in the mongo collection
module.exports = mongoose.model( 'Restaurant', RestaurantSchema );