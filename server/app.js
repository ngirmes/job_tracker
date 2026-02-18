const express = require('express')
const app = express()
const port = 3000

const db = require('./db')

const today = Date();

const myLogger = function(req, res, next){
    console.log(`LOGGED at ${today}`)
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

app.get('/jobs', (req, res) => {
     let jobs = ''

    try {
    jobs = db.all(
        `SELECT * FROM jobs`
    )
    res.send(jobs)
    }
    
    catch (err) {
        res.send(err.message)
    }
})

app.post('/jobs', jsonParser, (req, res) => {
    const {company, role, status} = req.body
    const sql = `INSERT INTO jobs (company, role, status) VALUES (?, ?, ?)`
    const params = [company, role, status]

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }

        res.json({
            message: 'Job added successfully',
            job: { id: this.lastID, company, role, status}
        })
    })
})

app.delete('/jobs:id', (req, res) => {
    res.send('Job Deleted')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})