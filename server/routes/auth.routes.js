const express = require('express')
const router = express.Router()

const jsonParser = require('../middleware/jsonParser')
const checkValidEmail = require('../middleware/checkValidEmail')
const validateAndHashPassword = require('../middleware/validateAndHashPassword')

// Import database connection (SQLite)
const db = require('../db/db')

const jwt = require('jsonwebtoken')

router.post('/register', jsonParser, checkValidEmail, validateAndHashPassword, (req, res) => {

    const { email, password } = req.body
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`

    db.run(sql, email, password, function(err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }

        res.status(200).json({
            message: 'User created successfully',
            user: { id: this.lastID, email, password }
        })
    })
})

router.get('/login', jsonParser, (req, res) => {
    const { email, password } = req.body
    const sql = `SELECT id, password FROM users WHERE email = ?`

    db.get(sql, email, async (err, user) => {
        if (!user) {
            return res.status(401).json({error: 'Invalid credentials'})
        }
        
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({error: 'Invalid credentials'})
        }

        const token = jwt.sign(
            { user_ID: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        )

        res.json({token})
    })
})

module.exports = router