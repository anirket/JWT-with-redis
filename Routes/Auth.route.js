const express = require('express');
const router = express.Router();
const createErrors = require('http-errors');
const { authSchema } = require('./../Helpers/schema_validation')
const User = require('./../Models/User.model');
const { signAccessToken } = require('../Helpers/generate_token');
const bcrypt = require('bcrypt');


router.post('/register', async (req, res, next) => {

    try {
        const result = await authSchema.validateAsync(req.body);

        const { email, password } = result

        const isUserexist = await User.findOne({ email: email })

        if (isUserexist) {
            throw createErrors.Conflict('User Already Exist')
        }

        const user = new User({
            email,
            password,
        })

        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id);


    res.send({accessToken})

    } catch (error) {
        if (error?.isJoi) {
            error.status = 422;
        }
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({email: result.email});

        if(!user) {
            throw createErrors.NotFound('User Not Registered')
        }

        const isMatch = await user.isValidPassword(result.password);

        if(!isMatch) {
            throw next(createErrors.Unauthorized('Invalid Username/ Password'))
        }

        const access_token = await signAccessToken(user.id);
        
        res.send({access_token});

    } catch (error) {
        if (error?.isJoi) {
            return next(createErrors.BadRequest("Invalid Username/ Password"))
        }
        next(error)
    }
})

router.post('/refresh-token', async (req, res, next) => {
    res.send('Refresh token')
})

router.delete('/logout', async (req, res, next) => {
    res.send('Logout')
})


module.exports = router;