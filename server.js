const express = require("express")
const helmet = require("helmet")
const session = require("express-session")

const usersRouter = require("./users/users-router")
const authRouter = require("./auth/auth-router")
const authenticator = require("./auth/authenticator")
const server = express()

const sessionConfig = {
name: "whatever",
secret: process.env.SESSION_SECRET || "keep it secret",
resave: false,
saveUninitialized: process.env.SEND_COOKIES || true,
cookie: {
    maxAge: 1000 * 60 * 10, // good for 10 min
    secure: process.env.USE_SECURE_COOKIES || false,
    httpONLY: true
  }
}

server.use(helmet())
server.use(express.json())
server.use(session(sessionConfig))

server.use("/api/users", authenticator, usersRouter)
server.use("/api/auth", authRouter)


server.get("/", (req, res) => {
    res.json({api: "up"})
});

module.exports = server;