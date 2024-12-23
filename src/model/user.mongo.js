const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: {type: String,
            required: true},
    username: {type: String, required: true},
    email: {type: String,required: true,},
    phoneNumber: {type: String,required: true},
    address : {type: String,required: true},
    city: {type: String,required: true},
    password: {type : String, required: true},
    tokens: [{
        token: {
            type: String,
        }
    }],
    refreshToken: {type: String},
    deletedAt : { type: Date, default: null }
});

module.exports = mongoose.model('user', usersSchema)