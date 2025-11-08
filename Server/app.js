const express = require("express");

const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const authRouter = require("./Controllers/signUpController");
const userRouter = require("./Controllers/userController")
const chatRouter = require("./Controllers/ChatController")
const messagesRouter = require("./Controllers/messages")
const cors = require("cors")
let { Server } = require("socket.io");
let rateLimter = require("express-rate-limiter")

let onlineUsers = new Map();
app.use(cors({
  origin: '*',  // your frontend URL
  credentials: true
}));

let server = require("http").createServer(app);

let io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
})
io.on("connection", socket => {
  console.log(`Total connections: ${io.engine.clientsCount}`);
  socket.on("join-room", userId => {
    onlineUsers.set(socket.id, userId)
    socket.join(userId)
    console.log(onlineUsers);
    io.emit("online-users", Array.from(onlineUsers.values()))
  })


  socket.on("send-message", (newMessage) => {
    let { members } = newMessage;
    console.clear();
    console.log(newMessage)
    io.to(members[0]).emit("receive-message", newMessage)
    io.to(members[1]).emit("receive-message", newMessage)
  })
  socket.on("clear-unread-messages", (data) => {
    let { members } = data;
    io.to(members[0]).emit("message-cleared", data)
    io.to(members[1]).emit("message-cleared", data)
  })
  socket.on("typing-indicator", (data) => {

    console.log(data)
    io.to(data.members[0]).emit("user-is-typing", data)

  })
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    onlineUsers.delete(socket.id)
    console.log(`Total connections: ${io.engine.clientsCount}`);

  })


})

app.use(express.json(
  { limit: '50mb' }
))
// app.use(rateLimter({
//   windows
// }))
app.use((req, res, next) => {
  debugger
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use("/api/auth", authRouter)

app.use("/api/user/", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/messages", messagesRouter)
module.exports = server;