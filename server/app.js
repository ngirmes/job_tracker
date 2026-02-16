const express = require('express')
const app = express()
const port = 3000

const db = require('./db')

const myLogger = function(req, res, next){
    console.log('LOGGED')
    next()
}

//json parsing middleware (could just use express.json() but wanted to show understanding)
const jsonParser = (req, res, next) => {
    // only run for requests that SHOULD have a body
    if (req.method === 'POST' || req.method === 'PUT') {
        let data = ''

        req.on('data', chunk => {
            data += chunk
        })

        req.on('end', () => {
            if (!data) {
                req.body = {}
                return next()
            }

            try {
                req.body = JSON.parse(data)
                next()
            } catch (err) {
                res.status(400).json({ error: 'Invalid JSON' })
            }
        })
    } else {
        next()
    }
}


app.use(myLogger)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/jobs', (req, res) =>{
    res.send(placeholder_data)
})

app.post('/jobs', jsonParser, (req, res) => {
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