require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const createErrors = require('http-errors');
const AuthRoutes = require('./Routes/Auth.route');
const { verifyAccessToken } = require('./Helpers/generate_token');
require('./Helpers/init_MongoDb')

const app = express();
app.use(morgan('short'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', verifyAccessToken, async(req, res, next) => {
    res.send('Hello')
})

app.use('/auth', AuthRoutes)

app.use(async(req, res, next) => {
    next(createErrors.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`)
})