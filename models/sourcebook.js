const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    short_name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Source_Book',bookSchema)