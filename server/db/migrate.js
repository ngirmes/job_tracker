// For database changes/migrations
// Ex: Recreating a table

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../jobs.db')

db.serialize( () => {
    db.run(`ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT 0`)
})


