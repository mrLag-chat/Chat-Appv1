const router = require("express").Router();
const User = require("../Models/userModel");
const authMiddleWare = require("../Middlewares/authMiddleware");
const cloudinary = require("../Controllers/cloudinary");
const jwt = require("jsonwebtoken")


router.get("/get-Loggedin-user", authMiddleWare, async (req, res) => {
    try {
        let userId = req.body.userId;
        let user = await User.findOne({ _id: userId });
        if (user) {
            res.status(200).json({
                success: true,
                message: "User Fetched Successfully",
                user,
            })
        }
        else {
            res.status(401).json({
                success: false,
                message: "No user Found",
                user,
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        })
    }
})
router.get("/get-all-users", authMiddleWare, async (req, res) => {
    try {
        let userId = req.body.userId;
        let users = await User.find({ _id: { $ne: userId } });
        res.status(200).json({
            success: true,
            message: "All Users Fetched Successfully",
            users,
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        })
    }
})
router.post("/profile", authMiddleWare, async (req, res) => {
    try {
        let userId = req.body.userId;
        let fileStr = req.body.image;
        const result = await cloudinary.uploader.upload(fileStr, {
            folder: 'Chat_App_profile'
        });
        console.log(result);
        let user = await User.findOneAndUpdate({ _id: userId }, {
            profilePic: result.url
        }, { new: true })
        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user,
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        })
    }
})

router.post("/verify-otp", async (req, res) => {
    let { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "please provide valid Details"
        })
    }
    let user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "No user Found"
        })
    }
    if (otp && otp.length < 6) {
        return res.status(400).json({
            success: false,
            message: "please provide valid Details"
        })
    }

    if (user.otp != otp) {
        return res.status(400).json({
            success: false,
            message: "invalid otp"
        })
    }
    let currentTime = Date.now();
    if (user.otpExpire < currentTime) {
        return res.status(400).json({
            success: false,
            message: "otp expired"
        })
    }
    user.otp = null;
    user.otpExpire = null;
    user.isVerified = true;
    await user.save();
    let token = jwt.sign({ userId: user._id }, process.env.JWT_Secret, { expiresIn: process.env.JWT_EXPAIRY });
    res.status(200).json({
        success: true,
        message: "user Loggedin successfully",
        token,
    })

})

module.exports = router;