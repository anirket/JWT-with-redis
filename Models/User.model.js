const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        lowercase: true,
    },
})


const User = mongoose.model('user', UserSchema)

module.exports = User;