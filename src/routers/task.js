const express = require('express')
const router = new express.Router()
const connection = require('../db/mysql')

router.post('/task', (req, res)=>{
    const task = req.body

    connection.query('INSERT INTO TaskHasTaskList SET ?', task, (err,task)=>{
        if(err) return console.log(err) 

       res.status(201).send(task)
    })
})

router.get('/task', (req, res)=>{
    connection.query('SELECT * FROM TaskHasTaskList', (err, tasks)=>{
        if(err) return res.status(500).send(err)
        console.log('Successfully get user information')
        res.send(tasks)
    })
})


router.get('/task/:id', (req, res)=>{
    const _id = req.params.id
    connection.query('SELECT * FROM TaskHasTaskList WHERE taskID = ?',_id, (err, task)=>{
        if(err || !result) return res.status(500).send(err)
        console.log('Successfully specific user id information')
        res.send(task)
    })
})

router.put("/task/:id", (req, res)=>{

    const _id = req.params.id
    const obj = req.body
    connection.query('UPDATE TaskHasTaskList SET ? WHERE taskID = ?',[obj,_id], (err,result)=>{
        if(err){
		console.log(err)
		return res.send(err)
	}
	console.log('Successfully update user information')
        res.send(result)
    })
})

router.delete('/task/:id', (req, res)=>{
    connection.query('DELETE FROM TaskHasTaskList WHERE taskID = ?', req.params.id, (err, result)=>{
        if(err) return res.status(500).send()

        res.send('Successfully delete the task with id '+req.params.id)
    })
 })

module.exports = router


// router.patch('/tasks/:id', async (req, res)=>{
    //     const updates = Object.keys(req)
    //     const allowedUpdates  = ['name', 'description', 'completed']
    //     const isValidOperation = updates.every((update)=>{
    //         return allowedUpdates.includes(update)
    //     })
    
    //     if(!isValidOperation) return res.status(400).send({error: 'Invalid updates!'})
    
    //     try {
    //         const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
    
    //         if(!task) return res.status(404).send()
    
    //         res.send(task)
    //     } catch(e) {
    //         res.status(400).send()
    //     }
    // })