const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema; //used to shorten mongoose.Schema types

const RestaurantSchema = new Schema( {
    title: String,
    priceRange: String,
    description: String,
    location: String
} );

module.exports = mongoose.model( 'Restaurant', RestaurantSchema );