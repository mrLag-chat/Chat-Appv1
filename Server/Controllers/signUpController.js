const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const { sendOtp } = require("../Controllers/sendOtp");

router.post("/signUp", async (req, res) => {
    try {
        debugger
        let { firstname, lastname, email, password, profilePic } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                message: "User Already Exist",
                success: false,
            })
        }
        let hasPassword = await bcrypt.hash(password, 10);
        password = hasPassword;
        let newUser = new User({ firstname, lastname, email, password, profilePic });

        const Otp = Math.floor(Math.random() * 1000000);
        await sendOtp(email, Otp);
        newUser.otp = Otp;
        newUser.otpExpire = Date.now() + 5 * 60 * 1000;
        console.log(Otp);
        let result = await newUser.save();
        res.status(201).json({
            message: "User Created Successfully",
            success: true,
        })
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
            Error: e
        })
    }
});


router.post("/Login", async (req, res) => {
    debugger
    let { email, password } = req.body;
    let user = await User.findOne({ email: email })
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "invalid User"

        })
    }
    let isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({
            success: false,
            message: "invalid User"
        })
    }
    let token = jwt.sign({ userId: user._id }, process.env.JWT_Secret, { expiresIn: process.env.JWT_EXPAIRY });
    res.status(200).json({
        success: true,
        message: "user Loggedin successfully",
        token,
    })

})



module.exports = router;
