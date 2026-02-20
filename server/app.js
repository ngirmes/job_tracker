// Import Express framework
const express = require('express')
const app = express()
const port = 3000

const bcrypt =  require('bcrypt')

// Import database connection (SQLite)
const db = require('./db')

// Capture current date/time for logging
const today = Date();

// ---------------------
// Middleware
// ---------------------

//Simple request logger middleware
const myLogger = function(req, res, next){
    console.log(`LOGGED at ${today}`)
    next()
}

// Parses JSON request bodies and attaches them to req.body
// Demonstrates understanding; could also use built-in express.json()
function jsonParser (req, res, next) {

    // Only run for requests that SHOULD have a body
    let data = ''

    // Listen for chunks of data being sent
    req.on('data', chunk => {
            data += chunk
    })

    req.on('end', () => { 
        if (!data) {
            // No body sent, assign empty object
            req.body = {}
            return next()
        }

        try {
            // Parse JSON and attach to request object
            req.body = JSON.parse(data)
            next()
        } catch (err) {
            res.status(400).json({ error: 'Invalid JSON' })
        }
    })
} 

// Validate that the user exists before posting a job
function validateUser (req, res, next) {

    // Extract user_ID from params and coerce to Number
    const user_ID = Number(req.params.user_ID)

    if (Number.isNaN(user_ID)) {
        return res.status(400).json({message: 'Invalid user ID'})
    }
    
    // SQL to check if the user exists
    const sql = `SELECT 1 FROM users WHERE id = ? LIMIT 1`

    db.get(sql, user_ID, (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        else if (!row) {
            return res.status(404).json({error: 'User does not exist'})
        }

        // User exists, continue to next middleware/route
        next()
    })
}

// Validate that the status field is present and valid
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

async function validateAndHashPassword (req, res, next) {
    const {password} = req.body

    if (!password) {
        return res.status(400).json({message: 'User must enter a password'})
    }
    else if (password.length < 8) {
        return res.status(400).json({message: 'Password must be longer than eight characters'})
    }

    try {
    const hashedPassword = await bcrypt.hash(password, 10)
    req.body.password = hashedPassword
    next()
    }
    catch {
        return res.status(500).json({error: 'Failed to hash password'})
    }

    
}

// Global Middleware
app.use(myLogger)

// ---------------------
// Routes
// ---------------------

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// ***
// Auth Routes
// ***

app.post('/auth/register', jsonParser, validateAndHashPassword, (req, res) => {

} )

app.post('/auth/login', jsonParser, (req, res) => {

})

// Create new user
app.post('/users', jsonParser, (req, res) => {
    const { email, password } = req.body
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`

    db.run(sql, email, password, function(err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }

        res.json({
            message: 'User created successfully',
            user: { id: this.lastID, username }
        })
    })
})

// ***
//Jobs Routes
// ***

app.get('/jobs', (req, res) => {
    db.all(`SELECT * FROM jobs`, (err, rows) => {
        if (err) {
            res.send(err.message)
        }
        else {
            // Return JSON array of all jobs
            res.json(rows)
        }

    })
})

// Create a new job for a specific user
app.post('/jobs/:user_ID', jsonParser, validateUser, validateStatus, (req, res) => {
    const { user_ID } = req.params
    const {company, role, status} = req.body

    // Parameterized SQL prevents SQL injection
    const sql = `INSERT INTO jobs (user_ID, company, role, status) VALUES (?, ?, ?, ?)`
    const params = [user_ID, company, role, status]

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }

        // Return success message and the new job’s ID
        res.json({
            message: 'Job added successfully',
            job: { id: this.lastID, user_ID, company, role, status}
        })
    })
})

// Update a job’s status
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

// Delete a job by ID
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

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})