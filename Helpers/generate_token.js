const JWT = require('jsonwebtoken');
const createErrors = require('http-errors');


module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_SECRET_KEY;
            const options = {
                expiresIn: "1h",
                issuer: 'aniketk.in',
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    return reject(createErrors.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        const { authorization: token = null } = req.headers;

        if(!token) {
            return next(createErrors.Unauthorized());
        }

        const bearertoken = token.split(' ')[1];

        JWT.verify(bearertoken, process.env.ACCESS_SECRET_KEY, (err, payload) => {
            if(err) {
                return next(createErrors.Unauthorized());
            }
            req.payload = payload;
            next();
        });
    }
}