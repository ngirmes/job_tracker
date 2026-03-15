// For database changes/migrations
// Ex: Recreating a table

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../data.db");

db.serialize(() => {
  db.run(`ALTER TABLE jobs ADD COLUMN dateApplied TEXT NOT NULL`);
  /*db.run(`CREATE TABLE IF NOT EXISTS subscriptions
        (
            user_ID INTEGER PRIMARY KEY,
            plan TEXT NOT NULL,
            status TEXT NOT NULL,
            price FLOAT NOT NULL,
            billing_cycle TEXT NOT NULL,
            next_billing_date TEXT NOT NULL,
            
        )`);*/
});
