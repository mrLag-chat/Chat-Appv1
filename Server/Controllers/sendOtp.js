const nodeMailer = require("nodemailer")
let transPort = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.Node_Mailer_Email,
        pass: process.env.GOOGLE_APP_PASSWORD,
    }
})
async function sendOtp(to, otp) {
    const mailOptions = {
        from: process.env.Node_Mailer_Email,
        to: to,
        subject: "OTP",
        text: `Your OTP is ${otp}`
    }
    try {
        let result = await transPort.sendMail(mailOptions);
        return { success: true, result, message: "OTP sent successfully" }
    } catch (e) {
        return { success: false, message: e.message }
    }


}
module.exports = { sendOtp }