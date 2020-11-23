const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const taskListRouter = require("./routers/taskList");
const routeRouter = require("./routers/routes");

const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(taskListRouter);
app.use(routeRouter);

module.exports = { app, server };