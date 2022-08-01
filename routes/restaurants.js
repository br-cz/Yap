const express = require( 'express' );
const router = express.Router();
const asyncWrapper = require('../utils/AsyncWrapper');
const Restaurant = require('../models/restaurant');
const {isLoggedIn, validateRestaurant, isAuthor} = require('../middleware.js');
const restaurantsController = require('../controllers/restaurants');

router.get( '/', asyncWrapper(restaurantsController.index));

//must be above id because if not, the route will try to find a restaurant with id of "new"
router.get( '/new', isLoggedIn, restaurantsController.renderNewForm)

router.post( '/', isLoggedIn, validateRestaurant, asyncWrapper( restaurantsController.createCampground))


router.get( '/:id', asyncWrapper(restaurantsController.showCampground));

//EDIT PAGE
router.get( '/:id/edit', isLoggedIn, isAuthor, asyncWrapper(restaurantsController.renderEditForm));

//post request faked as put request
router.put( '/:id', isLoggedIn, isAuthor, validateRestaurant, asyncWrapper(restaurantsController.updateCampground));

router.delete( '/:id', isLoggedIn, isAuthor, asyncWrapper(restaurantsController.deleteCampground));

module.exports = router;