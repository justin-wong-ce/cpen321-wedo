const express = require('express')
const connection = require('../db/mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../auth/auth')
const router = new express.Router()

// helper function:
// const getUser = (id)=>{
//     return new Promise((resolve, reject)=>{
//         connection.query('SELECT * FROM User WHERE userID = ?',_id, (err, user)=>{
//             if(err || !result) reject(err)
//             console.log('Successfully find user')
//             resolve(user)
//         })
//     })
// }

router.post('/user/signup', async (req, res)=>{
    const user = req.body
    try{
        user.password = await bcrypt.hash(user.password, 8)
        const token = await jwt.sign({userID: user.userID.toString()}, 'userLogIn')
        user["token"] = token

        connection.query('INSERT INTO User SET ?', user, (err,result)=>{
            if(err) return console.log(err) 

            // the token is very important to identifying you as a valid user
            res.status(201).send(token)
        })
    } catch(e){
        console.log(e)
    }
    
})


// to log in, must provide account info + password
router.post('/user/login', (req, res)=>{
    console.log("enttereee")

    try{
        connection.query('SELECT * FROM User WHERE userID = ?',req.body.userID, async (err, users)=>{
            if(err || !users) return res.status(500).send('Unable to log in 1')
	    
	        const user = users[0]
            const isMatch = await bcrypt.compare(req.body.password, user.password)
            console.log(req.body.password)
            if(!isMatch) return res.status(500).send('Unable to log in 2')

            const token = await jwt.sign({userID: user.userID.toString()}, 'userLogIn')
            connection.query('UPDATE User SET token = ? WHERE userID = ?',[token,user.userID], (err,result)=>{
                if(err){
                    console.log(err)
                    return res.send('Unable to log in 3')
                }
                res.send({"token":token})
            })
            
        })
    } catch(e){
        console.log(e)
	    return res.status(500).send('Unable to log in')
    }
    
})

// given the userID and token
router.get('/user/me', auth, async (req, res)=>{
    res.send(req.user)
})


// should delete this later
router.get('/user', (req, res)=>{

    connection.query('SELECT * FROM User', (err, users)=>{
        if(err) return res.status(500).send(err)
        console.log('Successfully get user information')
        res.send(users)
    })
})

// should delete this later
router.get('/user/:id', async (req, res)=>{
    const _id = req.params.id
    connection.query('SELECT taskListID FROM User WHERE userID = ?',_id, (err, user)=>{
        if(err || !user) return res.status(500).send(err)
        console.log('Successfully specific user id information')
	    console.log(user[0].password)
        res.send(user)
    })
})

// should delete this later
router.put("/user/:id", (req, res)=>{
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

router.put("/user", auth, async (req, res)=>{
    const obj = req.body

    obj["userID"] = req.user.userID
    const updates = Object.keys(req.body)
    const shouldUpdatePassword = updates.every((update)=>{
        return update!='password'
    })
    
    if(!shouldUpdatePassword) obj.password = await bcrypt.hash(req.body.password, 8)
    
    connection.query('UPDATE User SET ? WHERE userID = ?',[obj,req.user.userID], (err,result)=>{
        if(err){
		console.log(err)
		return res.send(err)
	}
	console.log('Successfully update user information')
        res.send(result)
    })
})

// need auth later
router.delete('/user/:id', (req, res)=>{
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
