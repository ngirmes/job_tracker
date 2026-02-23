const express = require('express')
// Import database connection (SQLite)
const router = express.Router()

const {register, login} = require('../controllers/authController')
const jsonParser = require('../middleware/jsonParser')
const checkValidEmail = require('../middleware/checkValidEmail')
const validateAndHashPassword = require('../middleware/validateAndHashPassword')

router.post('/register', jsonParser, checkValidEmail, validateAndHashPassword, register)
router.post('/login', jsonParser, login)

module.exports = router