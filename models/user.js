const mongoose = require('mongoose')

//define the user schema 
const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    age:{
        type:Number,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    email:{
        type: String
    },
    address:{
        type: String,
        required: true
    },
    aadhaarCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter' , 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User