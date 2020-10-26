const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const taskListRouter = require('./routers/taskList')
const routeRouter = require('./routere/routes')

const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server)
//const io = socketio(http)
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirectoryPath))
//app.get('/', (req,res)=>{
//	res.sendFile(__dirname + '/../public/index.html');
//});
/*
 * JSON FORMATTING:
 * (put JSON field names here for reference later)
 */

// Post function
// Receives JSON file, stores data to DB according to JSON format
// app.post("/", function (req, res) {

// });

// Get function
// parse request and send back data
// app.get("/", (req, res) => {

// });

// Put function
// put requested data into DB
// app.put("/", function (req, res) {
// });

// Delete function
// delete data from DB
// app.delete("/", function (req, res) {
// });

app.use(userRouter)
app.use(taskRouter)
app.use(taskListRouter)
app.use(routeRouter)

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
})

server.listen(port, () => {
    console.log('Server is up on port' + port)
})

