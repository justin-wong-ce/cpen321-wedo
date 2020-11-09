const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const taskListRouter = require("./routers/taskList");
const routeRouter = require("./routers/routes");
const pushnotification = require("./routers/pushNotification");

const socketio = require("socket.io");
const http = require("http");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(taskListRouter);
app.use(routeRouter);
app.use(pushnotification);

app.get("/", function (req, res) {
    console.log("co");
    res.send("hello");
});

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.emit("You\"v successfully received the push notifications");

    // before doing something, join the user to every room they should be:
    socket.on("join", (chatID) => {
        console.log("User has joined " + chatID);
        socket.join(chatID);
    })

    // TODO: if a user send message, get the user ID, send to the other user who is in the chat room
    // with chatID:
    socket.on("sendMessages", (chatID, message) => {
        console.log(message);
        io.to(chatID).emit(message);
    })


    // disconnect the user:
    socket.on("disconnect", () => {
        console.log("disconnecting");
    })
})

server.listen(port, () => {
    console.log("Server is up on port" + port);
})