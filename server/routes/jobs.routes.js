const express = require('express')
const router = express.Router()

const jsonParser = require('../middleware/jsonParser')
const validateUserExists = require('../middleware/validateUserExists')
const validateParamStatus = require('../middleware/validateParamStatus')

// Import database connection (SQLite)
const db = require('../db/db')

router.get('/', (req, res) => {
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
router.post('/:user_ID', jsonParser, validateUserExists, validateParamStatus, (req, res) => {

    const { user_ID } = req.params
    const { company, role, status } = req.body

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
router.patch('/:user_ID/:id', jsonParser, validateParamStatus, (req, res) => {
    const { user_ID, id } = req.params
    const { status } = req.body
    const sql = `UPDATE jobs SET status = ? WHERE user_ID = ? AND id = ?`

    db.run(sql, status, user_ID, id, function (err) {
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
router.delete('/:user_ID/:id', (req, res) => {

    const { user_ID, id } = req.params
    const sql = `DELETE FROM jobs WHERE user_ID = ? AND id = ?`

    db.run(sql, user_ID, id, function (err) {
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

module.exports = router