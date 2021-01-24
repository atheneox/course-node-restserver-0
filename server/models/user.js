const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    msg: '{ VALUE } is not valid role'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: { type: String, required: [true, 'name is required'] },
    email: { type: String, unique: true, required: [true, 'email is required'] },
    password: { type: String, required: [true, 'password is required'] },
    img: { type: String, },
    role: { type: String, default: 'USER_ROLE', enum: validRoles },
    status: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

userSchema.methods.toJSON = function () {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);