const Joi = require('joi');

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        title: Joi.string().required(),
        priceRange: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required(),
    }).required()
});
