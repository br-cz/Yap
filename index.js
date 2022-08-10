//process.env.NODE_ENV is an environment variable, which is either development or production
//essentially, when we deploy this app we will be in production
//So when we're not in production, this adds all our .env variables into process.env
if ( process.env.NODE_ENV !== "production" ) {
    require( 'dotenv' ).config();
}

const express = require( 'express' );
const app = express();
const path = require( 'path' );
const mongoose = require( 'mongoose' );
const methodOverride = require( 'method-override' );
const ejsMate = require( 'ejs-mate' );
const session = require( 'express-session' );
const ExpressError = require( './utils/ExpressError' );
const flash = require( 'connect-flash' );
const passport = require( 'passport' );
const PassportLocal = require( 'passport-local' );
const User = require( './models/user' );

const userRoutes = require( './routes/users' );
const restaurantRoutes = require( './routes/restaurants' );
const reviewRoutes = require( './routes/reviews' );

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yap-restaurants';
//const dbUrl = 'mongodb://localhost:27017/yap-restaurants'; //for development environment

const secret = process.env.SECRET || 'qtip';

const MongoStore = require( 'connect-mongo' );

// override with POST having ?_method=PUT
app.use( methodOverride( '_method' ) );

//here yap-restaurant is our temp db
mongoose.connect( dbUrl );

//helps verify everything is running smoothly
const db = mongoose.connection; //shorten code
db.on( "error", console.error.bind( console, "connection error!" ) );
db.once( "open", () => {
    console.log( "lets get it started!" );
} )

//to make sure res.body is not empty
app.use( express.urlencoded( { extended: true } ) );

app.engine( 'ejs', ejsMate );
app.set( 'view engine', 'ejs' )
app.set( 'views', path.join( __dirname, 'views' ) )

//allows usage of static assets in the specified folder, "public" is most commonly used
app.use( express.static( "public" ) );
app.use( express.static( path.join( __dirname, 'public' ) ) )

const store = MongoStore.create( {
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
} );

store.on( "error", function ( e ) {
    console.log( "Session Store has an error", e );
} );

const sessionConfig = {
    store, //makes our atlas db store our sessions to so it is far more scalable
    secret,
    resave: false,
    saveUninitialized: true, //temp
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7 //expire in a week, uses milliseconds
    }
}

app.use( session( sessionConfig ) )

// Both packages are set up with the app.use() middleware, like these lines:
// app.use(flash());
// app.use(passport.initialize());
// which makes their methods available in all routes automatically. Since we mount the rest of the routes on app.js when we use these lines,
// app.use('/', userRoutes);
// app.use( '/restaurants', restaurantRoutes );
// all routes in those files will have access to what was set up on app.js, taking into account what each package implemented behind the scenes. For example, the connect-flash package, as stated in the docs, does the following:
// "With the flash middleware in place, all requests will have a req.flash() function that can be used for flash messages."
app.use( flash() );

app.use( passport.initialize() );
app.use( passport.session() ); //must go bellow session(sessionConfig)

//Use Passport Local, where the authentication method is contained within User
passport.use( new PassportLocal( User.authenticate() ) );

//Remember: serialize/deserialize describes how to store and remove a user
passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );


//session(sessionConfig)) must be above this
//middleware for success flash flag
app.use( ( req, res, next ) => {
    res.locals.currentUser = req.user;
    //allows the flash to be used locally on every single request
    res.locals.success = req.flash( 'success' );
    res.locals.error = req.flash( 'error' );
    next();
} )

//must be below init of .flash(), allows us to use all routes from the passed in variables
app.use( '/', userRoutes );
app.use( '/restaurants', restaurantRoutes );
app.use( '/restaurants/:id/reviews', reviewRoutes );

app.get( '/', ( req, res ) => {
    res.render( 'home' );
} )

app.get( '/error', ( req, res ) => {
    res.render( 'error' );
} )

//'*' means for every path
app.all( '*', ( req, res, next ) => {
    next( new ExpressError( 'Page Not Found', 404 ) );
} )

app.use( ( err, req, res, next ) => {
    //Default code and message are arbitrary
    const { statusCode = 500 } = err;

    if ( !err.message ) err.message = 'Oops Error!';

    res.status( statusCode ).render( 'error', { err } );
} )

const port = process.env.PORT || 3000 //heroku's preset port
app.listen( port, () => {
    console.log( "working and listening :)" );
} )