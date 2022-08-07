const Restaurant = require( "../models/restaurant" );
const mbGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbToken = process.env.MAPBOX_TOKEN;
const geocoder = mbGeocoding({accessToken: mbToken});
const {cloudinary} = require("../cloudinary");


module.exports.index = async(req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants });
}

//must be above id because if not, the route will try to find a restaurant with id of "new"
module.exports.renderNewForm = (req, res) => {
    res.render('restaurants/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.restaurant.location,
        limit: 1
        })
        .send()
        // .then(response => {
        //   const match = response.body;
        // });
    console.log("Geo Data:\n");
    console.log(geoData.body.features[0].geometry.coordinates);
    // const restaurant = new Restaurant(req.body.restaurant); 
    // //allows us to fill in the image row fields in our restaurant model
    // restaurant.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    // restaurant.author = req.user._id;
    // await restaurant.save();
    // console.log(restaurant);
    // req.flash('success', 'Successfully made a new restaurant!');
    // res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.showCampground = async (req, res,) => {
        //Populate will automatically replace the specified path in the document, with document(s) from other collection(s),
    //which is what we need to display its fields, body and rating
    const restaurant = await Restaurant.findById(req.params.id).populate({
        //Used to find out who posted which review
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurant) {
        req.flash('error', 'Restaurant not found!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}

module.exports.renderEditForm = async (req, res) => {
    const restaurant = await Restaurant.findById( req.params.id );
    if(!restaurant){
        req.flash('error', 'Restaurant not found!');
        return res.redirect('/restaurants');
    }
    res.render( 'restaurants/edit', { restaurant } );
}

module.exports.updateCampground = async (req, res) => {
    //console.log(req.body);
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { ...req.body.restaurant });
    //the assignment returns an array, so we create this array variable and spread them (via ...) amongst the images
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    restaurant.images.push(...images); 
    await restaurant.save()

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await restaurant.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    await Restaurant.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully removed restaurant')
    res.redirect('/restaurants');
} 