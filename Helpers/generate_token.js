const JWT = require('jsonwebtoken');
const createErrors = require('http-errors');
const client = require('./init_redis');





module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_SECRET_KEY;
            const options = {
                expiresIn: "30s",
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
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFERSH_SECRET_KEY;
            const options = {
                expiresIn: "1y",
                issuer: 'aniketk.in',
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    return reject(createErrors.InternalServerError())
                }
                client.set(userId, token, {
                    'EX': 365 * 24 * 60 * 60
                }).then((res) => {
                    resolve(token)
                }).catch((err) => {
                    return reject(err)
                })

            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        const { authorization: token = null } = req.headers;

        if (!token) {
            return next(createErrors.Unauthorized());
        }

        const bearertoken = token.split(' ')[1];

        JWT.verify(bearertoken, process.env.ACCESS_SECRET_KEY, (err, payload) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return next(createErrors.Unauthorized());
                }
                return next(createErrors.Unauthorized(err.message));
            }
            req.payload = payload;
            next();
        });
    },
    verifyRefershToken: (token) => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.REFERSH_SECRET_KEY, (err, payload) => {
                if (err) {
                    return reject(createErrors.Unauthorized());
                }
                const userId = payload.aud;

                client.get(userId).then((reply) => {
                    console.log('aaa', reply, token)
                    if(reply === token) {
                        return resolve(userId);
                    }                    
                    return reject(createErrors.Unauthorized());

                }).catch((err) => {
                    next(createErrors.InternalServerError())
                })
            })
        })
    }
}