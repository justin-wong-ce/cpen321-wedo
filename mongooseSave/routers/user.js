const express = require('express')
const mysql = require('mysql')
const router = new express.Router()

const connection = mysql.createConnection({
    host:'localhost',
    user:'cpen321',
    password:'*cpen321Wed0$$',
    database: 'cpen321_wedo'
})

connection.connect((err)=>{
    if(err){
        console.log('Error connencting db')
        return
    }
    console.log('Connected!')
})

router.post('/users', (req, res)=>{
    console.log("fffff")
    res.send("fdfsds")
    // const user = req.body

    // connection.query('INSWER INTO User SET ?', user, (err,res)=>{
    //     if(err) return res.status(400).send(err)

    //     console.log('Last insert ID: ', res)
    //     res.status(201).send(user)
    // })
})


router.get('/users', async (req, res)=>{

    connection.query('SELECT * FROM User', (err, users)=>{
        if(err) return res.status(500).send(err)
        console.log('Successfully get user information')
        res.send(users)
    })
})

router.get('/users/:id', async (req, res)=>{
    const _id = req.params.id
    connection.query('SELECT * FROM User WHERE userID = ?',_id, (err, result)=>{
        if(err || !result) return res.status(500).send(err)
        console.log('Successfully specific user id information')
        res.send(result)
    })
})

// router.put("/user/:id", function (req, res) {
//     const key = Object.keys(req.body)

//     const _id = req.params.id
//     con.query('UPDATE User SET ')
// });

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

// router.delete('/users/:id', async (req, res)=>{
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)

//         if(!user) return res.status(404).send()

//         res.send(user)
//     } catch(e) {
//         res.status(500).send()
//     }
// })

module.exports = router