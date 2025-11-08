const mongoose = require("mongoose");

let chatSchema = new mongoose.Schema({
    members: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "users",
                required: true
            }
        ],

    },
    lastmessage: {
        type: mongoose.Schema.Types.ObjectId, ref: "messages",
        // required: true,
    },
    unreadMessagesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = new mongoose.model("chat", chatSchema)