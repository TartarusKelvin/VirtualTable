const mongoose = require("mongoose")
const path = require("path")

const coverImageBasePath="uploads/gamecovers/"

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    gm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String
    },
    coverName: {
        type: String
    }
})

gameSchema.virtual('coverImagePath').get(function(){
    if (this.coverName != null)
    {
        return path.join('/',coverImageBasePath,this.coverName)
    }
})

module.exports = mongoose.model('Game',gameSchema)
module.exports.coverImageBasePath = coverImageBasePath