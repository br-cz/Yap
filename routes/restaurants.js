const express = require( 'express' );
const router = express.Router();
const asyncWrapper = require('../utils/AsyncWrapper');
const Restaurant = require('../models/restaurant');
const {isLoggedIn, validateRestaurant, isAuthor} = require('../middleware.js');
const restaurantsController = require('../controllers/restaurants');

//used to handle multipart/form-data, what we use to handle file uploads
const multer = require('multer');
//Cloudinary: Programmable Media
//inspo: wanting a cloud service that allows for image transformations (https://www.reddit.com/r/node/comments/5k2jfl/best_cloud_image_upload_service/)
//API - based video and image management with dynamic transformations—for resizing, 
//cropping, overlays—automated optimization and accelerated delivery of content via CDNs
const {storage} = require('../cloudinary');
const upload = multer({storage});

//neat way to group similar paths
router.route('/')
    .get(asyncWrapper(restaurantsController.index))
    .post( isLoggedIn, upload.array('image'), validateRestaurant,  asyncWrapper( restaurantsController.createCampground))

//must be above id because if not, the route will try to find a restaurant with id of "new"
router.get( '/new', isLoggedIn, restaurantsController.renderNewForm)

router.route('/:id')
    .get( asyncWrapper(restaurantsController.showCampground))
    .put( isLoggedIn, isAuthor, upload.array('image'), validateRestaurant, asyncWrapper(restaurantsController.updateCampground))//post request faked as put request
    .delete( isLoggedIn, isAuthor, asyncWrapper(restaurantsController.deleteCampground));


//EDIT PAGE
router.get( '/:id/edit', isLoggedIn, isAuthor, asyncWrapper(restaurantsController.renderEditForm));

module.exports = router;