const Joi = require('joi');


const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.required(),
})

module.exports = {
    authSchema
};