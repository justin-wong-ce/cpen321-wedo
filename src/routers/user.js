const express = require('express')
const connection = require('../db/mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to log in')
    }

    return user
}

// to log in, must provide account info + password
router.post('/user/login', (req, res)=>{

    try{
        connection.query('SELECT * FROM User WHERE userID = ?',req.body.userID, async (err, user)=>{
            if(err || !user) return res.status(500).send('Unable to log in')

            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if(!isMatch) return res.status(500).send('Unable to log in')

            const token = await jwt.sign({userID: user.userID.toString()}, 'userLogIn')
            connection.query('UPDATE User SET token = ? WHERE userID = ?',[token,_id], (err,result)=>{
                if(err){
                    console.log(err)
                    return res.send('Unable to log in')
                }
                res.send(token)
            })
            
        })
    } catch(e){
        console.log(e)
    }
    
})


router.get('/user', (req, res)=>{

    connection.query('SELECT * FROM User', (err, users)=>{
        if(err) return res.status(500).send(err)
        console.log('Successfully get user information')
        res.send(users)
    })
})

router.get('/user/:id', async (req, res)=>{
    const _id = req.params.id
    connection.query('SELECT * FROM User WHERE userID = ?',_id, (err, user)=>{
        if(err || !user) return res.status(500).send(err)
        console.log('Successfully specific user id information')
        res.send(user)
    })
})

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
