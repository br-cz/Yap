const mongoose = require( 'mongoose' );
const Review = require('./review');
const Schema = mongoose.Schema; //used to shorten mongoose.Schema types

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//using the cloudinary API reference, this makes a 200 pixel wide thumbnail of our image for deletion interface
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})
const RestaurantSchema = new Schema( {
    title: String,
    images: [ImageSchema], //refactoring this out allows us to make the above function
    priceRange: Number,
    description: String,
    location: String,
    geometry: {
        type: {            // from Mongoose GeoJSON schema suggestion 
          type: String,    // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
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