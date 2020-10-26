const express = require('express')
const app = express()
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const taskListRouter = require('./routers/taskList')
const routeRouter = require('./routere/routes')

const port = process.env.PORT || 3000

app.use(express.json())


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

app.listen(port, () => {
    console.log('Server is up on port' + port)
})

