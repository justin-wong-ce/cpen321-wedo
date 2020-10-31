const express = require('express')
const router = new express.Router()
const connection = require('../db/mysql')
const auth = require('../auth/auth')

// do not include userID in the task pls.
router.post('/taskList', auth, (req, res)=>{
    const taskList = req.body

    taskList["userID"] = req.user.userID
    connection.query('INSERT INTO TaskListWithOwner SET ?', taskList, (err,taskList)=>{
        if(err) return console.log(err) 

        const hasAccess = {userID: req.body.userID, taskListID: req.body.taskListID}
        connection.query('INSERT INTO HasAccess SET ?', hasAccess, (err,result)=>{
            if(err) return console.log(err) 

            res.status(201).send(result)
        })
    })

    
})

router.get('/taskList', auth, (req, res)=>{
    connection.query('SELECT * FROM TaskListWithOwner WHERE userID = ?', req.user.userID, (err, taskList)=>{
        if(err) return res.status(500).send(err)
        console.log('Successfully get user information')
        res.send(taskList)
    })
})

// delte this later
router.get('/taskList/admin', (req, res)=>{
    connection.query('SELECT * FROM TaskListWithOwner', (err, taskList)=>{
        if(err) return res.status(500).send(err)
        console.log('Successfully get user information')
        res.send(taskList)
    })
})

// delete this later
router.get('/taskList/:id', (req, res)=>{
    const _id = req.params.id
    connection.query('SELECT * FROM TaskListWithOwner WHERE taskListID = ?',_id, (err, taskList)=>{
        if(err || !result) return res.status(500).send(err)
        console.log('Successfully specific user id information')
        res.send(taskList)
    })
})

router.put("/taskList/:id", auth, (req, res)=>{

    const _id = req.params.id
    const obj = req.body

    connection.query('SELECT * FROM HasAccess WHERE taskListID = ? AND userID = ?', [_id,req.user.userID], (err, hasAccess)=>{
        if(err || !result) return res.status(500).send('Cannot modify taskList because that\'s not belongs to you ')

        connection.query('UPDATE TaskListWithOwner SET ? WHERE taskListID = ?',[obj,_id], (err,result)=>{
            if(err){
                console.log(err)
                return res.send(err)
            }
            console.log('Successfully update user information')
            res.send(result)
        })
        
    })
    
    
})

// change to only head user can delete later
router.delete('/taskListsk/:id', auth, (req, res)=>{

    const _id = req.params.id
    
    connection.query('SELECT * FROM HasAccess WHERE taskListID = ? AND userID = ?',[_id,req.user.userID], (err, taskList)=>{
        if(err || !result) return res.status(500).send('Cannot modify taskList because that\'s not belongs to you ')
        
        connection.query('DELETE FROM TaskHasTaskList WHERE taskListID = ?', req.params.id, (err, result)=>{
            if(err) return res.status(500).send()
    
            res.send('Successfully delete the taskList with id '+req.params.id)
        })
    })

 })

module.exports = router
