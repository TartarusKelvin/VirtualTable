const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId, //eg Volos PHP ....
        ref: "Source_Book",
        required: false
    },
    ASI:{
        STR:{
            type: Number,
            required:true,
            default:0
        },
        DEX:{
            type: Number,
            required:true,
            default:0
        },
        CON:{
            type: Number,
            required:true,
            default:0
        },
        WIS:{
            type: Number,
            required:true,
            default:0
        },
        INT:{
            type: Number,
            required:true,
            default:0
        },
        CHA:{
            type: Number,
            required:true,
            default:0
        },
    },
    speed:{
        type: Number,
        required:true
    },
    darkvision:{
        type: Number,
        required: true
    },
    languages:{
        // Not Sure On This Yet
        type: String,
        required:false
    },
    ATTRIBUTES:[{
        name:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model("Race",raceSchema);