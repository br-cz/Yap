const express = require( 'express' );
const app = express();
const path = require( 'path' );
const mongoose = require( 'mongoose' );
const methodOverride = require( 'method-override' );
const ejsMate = require( 'ejs-mate' );
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const passport = require('passport');
const PassportLocal = require('passport-local');
const User = require('./models/user');

const restaurants = require('./routes/restaurants');
const reviews = require('./routes/reviews');


// override with POST having ?_method=PUT
app.use( methodOverride( '_method' ) )

//here yap-restaurant is our temp db
mongoose.connect( 'mongodb://localhost:27017/yap-restaurants' )

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
app.use(express.static(path.join(__dirname, 'public')))

app.use(flash());


const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true, //temp
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7 //expire in a week, uses milliseconds
    }
}

app.use(session(sessionConfig))

//session(sessionConfig) must be above this
//middleware for success flash flag
app.use((req, res, next) => {
    //allows the flash to be used locally on every single request
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/restaurants', restaurants)
app.use('/restaurants/:id/reviews', reviews)

app.use(passport.initialize());
app.use(passport.session()); //must go bellow session(sessionConfig)

//Use Passport Local, where the authentication method is contained within User
passport.use(new PassportLocal(User.authenticate()))

//Remember: serialize/deserialize describes how to store and remove a user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Handle url errors where the restaurant ID does not pass default validation, i.e. length < validLength
app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;

    if(err){
        req.flash('error', "Restaurant not found!");
        return res.redirect(`/restaurants`);
    }

    if(!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render('error',{err});
})

//tests user login
app.get('/user', async(req, res) => {
    const user = new User({email: 'emai1221l@gmail.com', username: 'use2121r123'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.get( '/', ( req, res ) => {
    res.render( 'home' );
} )

app.get( '/error', ( req, res ) => {
    res.render( 'error' );
} )


//'*' means for every path
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    //Default code and message are arbitrary
    const {statusCode = 500} = err;

    if(!err.message) err.message = 'Oops Error!';

    res.status(statusCode).render('error', { err });
})

app.listen( 3000, () => {
    console.log( "working and listening :)" );
} )