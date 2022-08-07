const mongoose = require( 'mongoose' );
const Restaurant = require( '../models/restaurant' );
const cities = require( './cities' );
const { places, descriptors } = require( './seedHelpers' );

//here yap-restaurant is our temp db
mongoose.connect( 'mongodb://localhost:27017/yap-restaurants' )

const db = mongoose.connection; //shorten code

//helps verify everything is running smoothly
db.on( "error", console.error.bind( console, "connection error!" ) );
db.once( "open", () => {
    console.log( "lets get it started!" );
} )

const sample = array => array[Math.floor( Math.random() * array.length )];

const seedDB = async () => {
    await Restaurant.deleteMany( {} );
    for ( let i = 0; i < 300; i++ ) {
        const random1000 = Math.floor( Math.random() * 1000 );
        const priceRange =  Math.floor( Math.random() * 200 )+ 10;
        const resto = new Restaurant( {
            //YOUR USER ID
            author: '62e5f30c37b823c492e741bc',
            //gives us some random description from seedHelpers
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample( descriptors )} ${sample( places )}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            images: [
                {
                    url: 'https://res.cloudinary.com/dkq6ijijx/image/upload/v1659804222/Yap/df7cpfnvmlc64kvg8rew.png',
                    filename: 'Yap/df7cpfnvmlc64kvg8rew',
                }
            ],
            priceRange
        } )
        await resto.save();
    }
}

seedDB().then( () => {
    mongoose.connection.close();
} )