const mongoose = require("mongoose");

mongoose.connect(process.env.CONN_STR);
let db = mongoose.connection;

db.on("connected", () => {
    console.log("Connected to mongo Db")
})
db.on("error", () => {
    console.log("Failed to connect")
})
module.exports = db;