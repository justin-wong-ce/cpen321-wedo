const express = require('express')
const router = new express.Router()
const connection = require('../db/mysql')

router.post('/taskList', (req, res)=>{
    const taskList = req.body

    connection.query('INSERT INTO TaskListWithOwner SET ?', taskList, (err,taskList)=>{
        if(err) return console.log(err) 

       res.status(201).send(taskList)
    })

    const hasAccess = {userID: req.body.userID, taskListID: req.body.taskListID}
    connection.query('INSERT INTO HasAccess SET ?', hasAccess, (err,result)=>{
        if(err) return console.log(err) 

       res.status(201).send(result)
    })
})

router.get('/task', (req, res)=>{
    connection.query('SELECT * FROM TaskListWithOwner', (err, taskList)=>{
        if(err) return res.status(500).send(err)
        console.log('Successfully get user information')
        res.send(taskList)
    })
})


router.get('/task/:id', (req, res)=>{
    const _id = req.params.id
    connection.query('SELECT * FROM TaskListWithOwner WHERE taskListID = ?',_id, (err, taskList)=>{
        if(err || !result) return res.status(500).send(err)
        console.log('Successfully specific user id information')
        res.send(taskList)
    })
})

router.put("/task/:id", (req, res)=>{

    const _id = req.params.id
    const obj = req.body
    connection.query('UPDATE TaskListWithOwner SET ? WHERE taskListID = ?',[obj,_id], (err,result)=>{
        if(err){
		console.log(err)
		return res.send(err)
	}
	console.log('Successfully update user information')
        res.send(result)
    })
})

router.delete('/task/:id', (req, res)=>{
    connection.query('DELETE FROM TaskHasTaskList WHERE taskListID = ?', req.params.id, (err, result)=>{
        if(err) return res.status(500).send()

        res.send('Successfully delete the taskList with id '+req.params.id)
    })
 })

module.exports = router