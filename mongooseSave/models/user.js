const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: [true, 'User has to have a name!'],
        trim: true
    },
    email:{
        type:String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalide')
            }
        }
    },
    password:{
        type: String,
        required:true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    timeJoined:{
        type: Date,
        // required: true
    }
})

module.exports = User