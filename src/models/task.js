const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    name:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        // TODO: check if the location is valid or not
        trim: true
    },
    lastModifiedTime: {
        type: Date
    },
    lastOpenTime: {
        type: Date
    },
    timeCreated: {
        type: Date,
        required: true
    },
    location: {
        type: location
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task