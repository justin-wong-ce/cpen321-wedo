const mysql = require('mysql')

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

module.exports = connection