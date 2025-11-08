const router = require("express").Router();
const Messages = require("../Models/messages");
const Chat = require("../Models/Chat");
const authMiddleWare = require("../Middlewares/authMiddleware");

router.post("/new-message", authMiddleWare, async (req, res) => {

    try {

        let { chatId, senderId, message, image } = req.body;
        let userMessage = new Messages({ chatId, senderId, message, image });
        let savedMessage = await userMessage.save();

        await Chat.findOneAndUpdate({ _id: chatId }, {
            lastmessage: savedMessage._id,
            $inc: { unreadMessagesCount: 1 }
        })

        res.status(200).send({
            success: true,
            message: "Message sent succssfully",
            data: savedMessage
        });
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e
        })
    }
});
router.get("/get-all-messages/:chatId", authMiddleWare, async (req, res) => {

    try {

        let chatId = req.params.chatId;
        let allMessages = await Messages.find({ chatId }).sort({ createdAt: 1 });
        res.status(200).send({
            success: true,
            message: "Message sent succssfully",
            allMessages: allMessages
        });
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e
        })
    }
});



module.exports = router;