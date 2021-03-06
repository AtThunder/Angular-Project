const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const schema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true }
})

mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)