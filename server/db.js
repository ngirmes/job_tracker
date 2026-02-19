const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./jobs.db', (err) =>  {
    if (err) {
        console.error('Error opening database', err)
    }
    else {
        console.log('Connected to SQLite database')
    }
})

db.serialize (() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_ID INTEGER NOT NULL,
            company TEXT NOT NULL,
            role TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (user_ID) REFERENCES users(id)
        ), 
    `)
})

module.exports = db