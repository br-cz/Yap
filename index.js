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

const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');


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
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //must go bellow session(sessionConfig)

//Use Passport Local, where the authentication method is contained within User
passport.use(new PassportLocal(User.authenticate()));

//Remember: serialize/deserialize describes how to store and remove a user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Both packages are set up with the app.use() middleware, like these lines:
// app.use(flash());
// app.use(passport.initialize());
// which makes their methods available in all routes automatically. Since we mount the rest of the routes on app.js when we use these lines,
// app.use('/', userRoutes);
// app.use('/campgrounds', campgroundRoutes)
// app.use('/campgrounds/:id/reviews',reviewRoutes)
// all routes in those files will have access to what was set up on app.js, taking into account what each package implemented behind the scenes. For example, the connect-flash package, as stated in the docs, does the following:
// "With the flash middleware in place, all requests will have a req.flash() function that can be used for flash messages."

//Handle url errors where the restaurant ID does not pass default validation, i.e. length < validLength
// app.use((err, req, res, next)=>{
//     const {statusCode = 500} = err;

//     if(err){
//         req.flash('error', "Restaurant not found!");
//         return res.redirec t(`/restaurants`);
//     }

//     if(!err.message) err.message = "Something went wrong!";
//     res.status(statusCode).render('error',{err});
// })

//session(sessionConfig)) must be above this
//middleware for success flash flag
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    //allows the flash to be used locally on every single request
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//below init of .flash()
app.use('/', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/restaurants/:id/reviews', reviewRoutes);

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