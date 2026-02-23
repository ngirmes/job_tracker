const db = require('../db/db')

async function getJobs(req, res) {
    const user_ID = req.user.user_ID

    db.all(`SELECT * FROM jobs where user_ID = ?`, user_ID, (err, rows) => {
        
        if (err) {
            return res.status(500).json({error: err.message})
        }
        if (!rows) {
            return res.status(400).json({error: 'No jobs found'})
        }
        res.json(rows)

    })
}

async function postJob(req, res) {
    const user_ID = req.user.user_ID
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
}

async function patchJob(req, res) {
    const user_ID = req.user.user_ID
    const { id } = req.params
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
}

async function deleteJob(req, res) {
    const user_ID = req.user.user_ID
    const { id } = req.params
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
}

module.exports = { getJobs, postJob, patchJob, deleteJob }




