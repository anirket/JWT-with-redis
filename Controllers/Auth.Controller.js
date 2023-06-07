const createErrors = require('http-errors');
const { authSchema } = require('./../Helpers/schema_validation')
const User = require('./../Models/User.model');
const { signAccessToken, signRefreshToken, verifyRefershToken } = require('../Helpers/generate_token');
const client = require('./../Helpers/init_redis');

module.exports = {

    registerController: async (req, res, next) => {

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
            const refresh_token = await signRefreshToken(savedUser.id);


            res.send({ accessToken, refresh_token })

        } catch (error) {
            if (error?.isJoi) {
                error.status = 422;
            }
            next(error)
        }
    },
    loginController: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body);
            const user = await User.findOne({ email: result.email });

            if (!user) {
                throw createErrors.NotFound('User Not Registered')
            }

            const isMatch = await user.isValidPassword(result.password);

            if (!isMatch) {
                throw next(createErrors.Unauthorized('Invalid Username/ Password'))
            }

            const access_token = await signAccessToken(user.id);
            const refresh_token = await signRefreshToken(user.id);


            res.send({ access_token, refresh_token });

        } catch (error) {
            if (error?.isJoi) {
                return next(createErrors.BadRequest("Invalid Username/ Password"))
            }
            next(error)
        }
    },
    refershTokenController: async (req, res, next) => {
        try {
            const { refresh_token = null } = req.body;

            if (!refresh_token) {
                throw createErrors.BadRequest();
            }

            const userId = await verifyRefershToken(refresh_token)


            const accessToken = await signAccessToken(userId);
            const refreshToken = await signRefreshToken(userId);

            res.send({ accessToken, refreshToken })

        } catch (error) {
            next(error)
        }
    },
    logoutController: async (req, res, next) => {
        try {
            const { refresh_token = null } = req.body;

            if (!refresh_token) {
                throw createErrors.BadRequest();
            }

            const userId = await verifyRefershToken(refresh_token);

            await client.DEL(userId);

            res.sendStatus(204);

        } catch (error) {
            next(error);
        }

    }


}