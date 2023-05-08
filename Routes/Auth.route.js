const express = require('express');
const router = express.Router();
const createErrors = require('http-errors');
const { authSchema } = require('./../Helpers/schema_validation')
const User = require('./../Models/User.model')


router.post('/register', async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const result = await authSchema.validateAsync(req.body);
        console.log(result)

        const isUserexist = await User.findOne({ email: email })

        if (isUserexist) {
            throw createErrors.Conflict('User Already Exist')
        }

        const user = new User({
            email,
            password,
        })

        const savedUser = await user.save();

        res.send(savedUser)

    } catch (error) {
        console.log(error)
        next(error)
    }

    // res.send('Register')
})

router.post('/login', async (req, res, next) => {
    res.send('Login')
})

router.post('/refresh-token', async (req, res, next) => {
    res.send('Refresh token')
})

router.delete('/logout', async (req, res, next) => {
    res.send('Logout')
})


module.exports = router;