const router = require("express").Router();
const Chat = require("../Models/Chat");
const Messages = require("../Models/messages");
const authMiddleWare = require("../Middlewares/authMiddleware");
const messages = require("../Models/messages");

router.post("/create-new-chat", authMiddleWare, async (req, res) => {
    try {
        let { members, lastmessage, unreadMessagesCount } = req.body;
        const existingChat = await Chat.findOne({ members: { $all: members, $size: members.length } });
        if (existingChat) {
            return res.status(200).json({
                success: true,
                message: "Chat already exists",
                data: existingChat,
            });
        }
        let chat = new Chat({ members, lastmessage, unreadMessagesCount });
        let savedChat = await chat.save();
        res.status(201).send({
            message: "chat created successfully",
            success: true,
            data: savedChat
        })
    }
    catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
})

router.get("/get-all-chat", authMiddleWare, async (req, res) => {
    try {
        let userId = req.body.userId;
        let chats = await Chat.find({ members: { $in: [userId] } }).populate("members").populate("lastmessage").sort({ updatedAt: -1 });
        res.status(200).send({
            message: "chats fetched successfully",
            success: true,
            data: chats
        })

    }
    catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
})
router.post("/clear-unread-messages", authMiddleWare, async (req, res) => {
    try {
        let chatId = req.body.chatId;
        let updatedChat = await Chat.findOneAndUpdate({ _id: chatId }, {
            unreadMessagesCount: 0
        }, { new: true })
        await Messages.updateMany({ chatId: chatId, read: false }, { read: true },)
        return res.status(200).json({
            success: true,
            message: "Unread messages cleared successfully",
            chat: updatedChat
        });
    }
    catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
})


module.exports = router;