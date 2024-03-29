const mongoose = require( 'mongoose' );
const Restaurant = require( '../models/restaurant' );
const cities = require( './cities' );
const { places, descriptors } = require( './seedHelpers' );

if ( process.env.NODE_ENV !== 'production' ) {
    require( 'dotenv' ).config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yap-restaurants';
// const dbUrl = 'mongodb://localhost:27017/yap-restaurants';

//here yap-restaurant is our temp db
mongoose.connect( dbUrl );

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
        const priceRange = Math.floor( Math.random() * 200 ) + 10;
        const resto = new Restaurant( {
            //YOUR USER ID
            author: '62f2fd220ad568e547403bd9',
            //gives us some random description from seedHelpers
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample( descriptors )} ${sample( places )}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            images: [
                {
                    url: 'https://res.cloudinary.com/dkq6ijijx/image/upload/v1660113618/Yap/os8i217jo2zwxcktwj4e.jpg',
                    filename: 'Yap/os8i217jo2zwxcktwj4e'
                }
            ],
            priceRange,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude] //the center of the earth, apparently (for seeded locations)
            }
        } )
        await resto.save();
    }
}

seedDB().then( () => {
    mongoose.connection.close();
} )