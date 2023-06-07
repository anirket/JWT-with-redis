const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
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
    },
})

UserSchema.pre('save', async function(next) {
    let user = this;
    if(user.isNew) {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error)
        }
    }
})

UserSchema.methods.isValidPassword = async function(password) {

    try {
        const result = await bcrypt.compare(password, this.password);
       return result;
    } catch (error) {
        throw(error)
    }

}


const User = mongoose.model('user', UserSchema)

module.exports = User;