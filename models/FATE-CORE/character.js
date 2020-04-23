const mongoose = require("mongoose")

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    refresh:{
        type:Number,
        required: true
    },
    aspects:{
        highConcept:{
            type:String,
            required:true
        },
        trouble:{
            type:String,
            required:true
        },
        additional:[{
            type:String,
        }]
    },
    skills:{
        superb:[{
            type: String,
        }],
        great:[{
            type: String,
        }],
        good:[{
            type: String,
        }],
        fair:[{
            type: String,
        }],
        average:[{
            type: String,
        }]
    },
    extras:[{
        type:String,
    }],
    stunts:[{
        type:String
    }],
    stress:{
        physical:{
            max:{
                type:Number,
                required:true
            },
            slots:[{
                type:Boolean,
            }]
        },
        mental:{
            max:{
                type:Number,
                required:true
            },
            slots:[{
                type:Boolean,
            }]    
        }
    },
    consequences:{
        mild:{
            type:String
        },
        secondMild:{
            type:String
        },
        moderate:{
            type:String
        },
        severe:{
            type:String
        },

    }
})

module.exports = mongoose.model('Fate_Core_Character',characterSchema)