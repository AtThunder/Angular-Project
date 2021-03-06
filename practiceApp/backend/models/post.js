const mongoose = require('mongoose');

const schema = mongoose.Schema({

    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true}
})

module.exports = mongoose.model('NewPost', schema)
