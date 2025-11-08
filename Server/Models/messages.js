const mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId, ref: "chats",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, ref: "users"
    },

    message: {
        type: String,
    },
    image: {
        type: String,

    },
    read: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const messages = new mongoose.model('messages', messageSchema);
module.exports = messages