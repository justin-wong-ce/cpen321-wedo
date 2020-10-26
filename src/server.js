const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const taskListRouter = require('./routers/taskList')
const socketio = require('socket.io')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirectoryPath))

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

io.on('connection', ()=>{
    console.log('New WebSocket connection')
})

server.listen(port, () => {
    console.log('Server is up on port' + port)
})

