const express = require('express')
const app = express()
const port = 3000

const db = require('./db')

const myLogger = function(req, res, next){
    console.log('LOGGED')
    next()
}

app.use(myLogger)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/jobs', (req, res) =>{
    res.send(placeholder_data)
})

app.post('/jobs', (req, res) => {
    // parse user data
    // add to database
    // send confirmation to user
})

app.update('/jobs:id', (req, res) => {
    res.send(updated_job)
})

app.delete('/jobs:id', (req, res) => {
    res.send('Job Deleted')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})