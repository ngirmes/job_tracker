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
function jsonParser (req, res, next) {
    // only run for requests that SHOULD have a body
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
} 

function validateStatus (req, res, next) {
    const { status } = req.body
    const validStatus = ['applied', 'offer', 'interviewed', 'rejected']

    if (!status) {
        res.status(400).json({message: 'Status is required'})
    }
    else if (!validStatus.includes(status)) {
        res.status(400).json({message: `Status must be one of: ${allowedStatuses.join(', ')}`})
    }
    
    next()
}

app.use(myLogger)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/jobs', (req, res) => {
    db.all(`SELECT * FROM jobs`, (err, rows) => {
        if (err) {
            res.send(err.message)
        }
        else {
            res.json(rows)
        }

    })
})

app.post('/jobs', jsonParser, validateStatus, (req, res) => {
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

app.patch('/jobs/:id', jsonParser, validateStatus, (req, res) => {
    const { id } = req.params
    const { status } = req.body
    const sql = `UPDATE jobs SET status = ? WHERE id = ?`

    db.run(sql, status, id, function (err) {
        if (err) {
            res.status(500).json({error: err.message})
        }
        else if (this.changes === 0) {
            res.status(404).json({error: 'Job not found'})
        }
        else {
            res.json({message: 'Job updated'})
        }
    })
})
 
app.delete('/jobs/:id', (req, res) => {

    const id = req.params.id
    const sql = `DELETE FROM jobs WHERE id = ?`

    db.run(sql, id, function (err) {
        if (err) {
            res.status(500).json({error: err.message})
        }
        else if (this.changes === 0) {
            res.status(404).json({error: 'Job not found'})
        }
        else {
            res.json({message: 'Job Deleted'})
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})