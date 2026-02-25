// Import Express framework
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173'
}))

const myLogger = require('./middleware/myLogger')

app.use(myLogger)
app.use('/auth', require('./routes/auth.routes'))
app.use('/jobs', require('./routes/jobs.routes'))

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})