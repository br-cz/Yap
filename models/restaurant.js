const mongoose = require( 'mongoose' );
const Review = require('./review');
const Schema = mongoose.Schema; //used to shorten mongoose.Schema types

const RestaurantSchema = new Schema( {
    title: String,
    image: String,
    priceRange: Number,
    description: String,
    location: String,
    author: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ,
    //1-to-Many relationship 
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
} );

RestaurantSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        //Generic deletion
        await Review.deleteMany({
            //the id of the review to be removed is in the doc reviews
            _id:{
                $in: doc.reviews
            }
        })
    }
})

//Restaurant becomes restaurants in the mongo collection
module.exports = mongoose.model( 'Restaurant', RestaurantSchema );