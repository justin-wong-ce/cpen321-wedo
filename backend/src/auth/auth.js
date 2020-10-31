const jwt = require('jsonwebtoken')
const connection = require('../db/mysql')

const auth  = (req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoder = jwt.verify(token, 'userLogIn')

	    console.log('helllo')
        connection.query('SELECT * FROM User WHERE userID = ?',decoder.userID, (err, users)=>{
            if(err || !users) return res.status(500).send('Please log in before seeing your personal information')
            console.log('hhhhhh')
            req.user = users[0]
            next()
        })
    }catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }

}

module.exports = auth
