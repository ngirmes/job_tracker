const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./jobs.db', (err) =>  {
    if (err) {
        console.error('Error opening database', err)
    }
    else {
        console.log('Connected to SQLite database')
    }
})

db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT,
        role TEXT,
        status TEXT
    )
`)

module.exports = db