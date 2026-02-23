// For database changes/migrations
// Ex: Recreating a table

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../jobs.db')

db.serialize( () => {
    db.run(`DELETE FROM users WHERE id = 4`)
})


