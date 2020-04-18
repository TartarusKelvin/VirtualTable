const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('User',userSchema)