const db = require('../db/db')
const NodeCache = require("node-cache")
const cache = new NodeCache({stdTTL: 60 })

async function getJobs(req, res) {

    const user_ID = req.user.user_ID
    const limit = req.query.limit || 5
    const page = req.query.page || 1
    const offset = (page - 1) * limit

    const sqlCount = `SELECT COUNT(*) AS total FROM jobs WHERE user_ID = ?`
    const sql = `SELECT * FROM jobs where user_ID = ? LIMIT ? OFFSET ?`

    const jobsKey = `jobs-${user_ID}-${page}`
    const totalKey = `jobs-total-${user_ID}`

    const cachedJobs = cache.get(jobsKey)
    const cachedTotal = cache.get(totalKey)

    if (cachedTotal && cachedJobs) {
        console.log('hi')
        return res.json({row: cachedTotal, rows: cachedJobs})
    }
    db.get(sqlCount, [user_ID], (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        else if (row.total === 0) {
            return res.status(400).json({error: 'No jobs found'})
        }


        db.all(sql, [user_ID, limit, offset], (err, rows) => {
                
            if (err) {
                return res.status(500).json({error: err.message})
            }
            cache.set(totalKey,row)
            cache.set(jobsKey, rows)
            res.json({row, rows})
        })
    })
}

async function postJob(req, res) {

    const user_ID = req.user.user_ID
    const { company, role, status, dateApplied } = req.body

    // Parameterized SQL prevents SQL injection
    const sql = `INSERT INTO jobs (user_ID, company, role, status, dateApplied) VALUES (?, ?, ?, ?, ?)`
    const params = [user_ID, company, role, status, dateApplied]

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }

        // Return success message and the new job’s ID
        cache.flushAll()
        res.status(201).json({
            message: 'Job added successfully',
            job: { id: this.lastID, user_ID, company, role, status, dateApplied}
        })
    })
}

async function patchJob(req, res) {

    const user_ID = req.user.user_ID
    const { id } = req.params
    const { status } = req.body
    const sql = `UPDATE jobs SET status = ? WHERE user_ID = ? AND id = ?`

    db.run(sql, [status, user_ID, id], function (err) {
        if (err) {
            res.status(500).json({error: err.message})
        }
        else if (this.changes === 0) {
            res.status(404).json({error: 'Job not found'})
        }
        else {
            cache.flushAll()
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
            cache.flushAll()
            res.status(204).send()
        }
    })
}

module.exports = { getJobs, postJob, patchJob, deleteJob }




