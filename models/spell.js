const mongoose = require("mongoose")

const spellSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    source_book:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Source_Book",
        required: true
    },
    level:{
        type: Number,
        required: true
    },
    range:{
        type: Number,
        required: true,
        default: 0
    },
    cast_time:{
        unit:{
            type: String,
            required: true,
        },
        len:{
            type: Number,
            required: true,
            default: 0
        },
    },
    components:{
        V:{
            type: Boolean,
            required: true,
            default: false
        },
        S:{
            type: Boolean,
            required: true,
            default: false
        },
        M:{
                type: String,
                required: false,
                default:""
        }
    },
    duration:{
        unit:{
            type: String,
            required: true,
        },
        len:{
            type: Number,
            required: true,
            default: 0
        },
        concentration:{
            type: Boolean,
            required: true,
            default: false
        }
    },
    description: {
        type: String
    },
    at_higher_level: {
        type: String
    }
})

module.exports = mongoose.model('Spell',spellSchema)