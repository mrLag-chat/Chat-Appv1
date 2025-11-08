const mongoose = require("mongoose");

let usersSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        //select: false
    },
    profilePic: {
        type: String
    },
    otp: {
        type: Number,
        maxLength: 6
    },
    otpExpire: {
        type: Number 
    },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });


let user = mongoose.model("users", usersSchema);
module.exports = user;