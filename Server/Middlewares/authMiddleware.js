
const jwt = require("jsonwebtoken");
const messages = require("../Models/messages");

module.exports = (req, res, next) => {
    try {
        if (!req.body) {
            req.body = {}
        }
        debugger;
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "Please Login to continue." })
        }
        let token = req.headers.authorization.split(" ")[1];
        let decodedToken = jwt.verify(token, process.env.JWT_Secret);
        if (!decodedToken) {
            return res.status(401).send({ message: "Please provide Valid Credentials." })
        }
        req.body.userId = decodedToken.userId;
        next()
    }
    catch (e) {
        res.status(401).json({
            success: false,
            message: e.message,
            Error: e
        })
    }



}