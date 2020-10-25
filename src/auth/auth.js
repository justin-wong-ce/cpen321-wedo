const jwt = require('jsonwebtoken')
const connection = require('../db/mysql')

const auth  = async (req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoder = jwt.verify(token, 'userLogIn')

        


        const user = await User.findOne({_id:decoder._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }

        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }

}

module.exports = auth