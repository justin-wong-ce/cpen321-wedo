const express = require('express')
const connection = require('../db/mysql')
const router = new express.Router()


router.post('/users', (req, res)=>{
    const user = req.body

    connection.query('INSERT INTO User SET ?', user, (err,user)=>{
        if(err) return console.log(err) 

       res.status(201).send(user)
    })
})


router.get('/users', (req, res)=>{

    connection.query('SELECT * FROM User', (err, users)=>{
        if(err) return res.status(500).send(err)
        console.log('Successfully get user information')
        res.send(users)
    })
})

router.get('/users/:id', (req, res)=>{
    const _id = req.params.id
    connection.query('SELECT * FROM User WHERE userID = ?',_id, (err, result)=>{
        if(err || !result) return res.status(500).send(err)
        console.log('Successfully specific user id information')
        res.send(result)
    })
})

router.put("/user/:id", (req, res)=>{
    //const key = Object.keys(req.body)

    const _id = req.params.id
    const obj = req.body
    connection.query('UPDATE User SET ? WHERE userID = ?',[obj,_id], (err,result)=>{
        if(err){
		console.log(err)
		return res.send(err)
	}
	console.log('Successfully update user information')
        res.send(result)
    })
})

router.delete('/users/:id', (req, res)=>{
    connection.query('DELETE FROM User WHERE id = ?', req.params.id, (err, result)=>{
        if(err) return res.status(500).send()

        res.send('Successfully delete the user with id '+req.params.id)
    })
    
})

module.exports = router



// router.patch('/users/:id', async (req, res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password']
//     const isValidOperation = updates.every((update)=>{
//         return allowedUpdates.includes(update)
//     })

//     if(!isValidOperation) res.status(400).send({error: 'Invalid updates! '})

//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

//         if(!user) return res.status(404).send()

//         res.send(user)
//     } catch(e) {
//         res.status(400).send(e)
//     }
// })
