const express = require( 'express' );
const router = express.Router();
const asyncWrapper = require('../utils/AsyncWrapper');
const Restaurant = require('../models/restaurant');
const {isLoggedIn, validateRestaurant, isAuthor} = require('../middleware.js');
const restaurantsController = require('../controllers/restaurants');

//neat way to group similar paths
router.route('/')
    .get(asyncWrapper(restaurantsController.index))
    .post( isLoggedIn, validateRestaurant, asyncWrapper( restaurantsController.createCampground))

//must be above id because if not, the route will try to find a restaurant with id of "new"
router.get( '/new', isLoggedIn, restaurantsController.renderNewForm)

router.route('/:id')
    .get( asyncWrapper(restaurantsController.showCampground))
    .put( isLoggedIn, isAuthor, validateRestaurant, asyncWrapper(restaurantsController.updateCampground))//post request faked as put request
    .delete( isLoggedIn, isAuthor, asyncWrapper(restaurantsController.deleteCampground));


//EDIT PAGE
router.get( '/:id/edit', isLoggedIn, isAuthor, asyncWrapper(restaurantsController.renderEditForm));

module.exports = router;