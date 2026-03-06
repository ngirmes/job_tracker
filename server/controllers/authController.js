const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // load env.
const db = require("../db/db");

async function register(req, res) {
  const { email, password } = req.body;
  const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;

  db.run(sql, email, password, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      message: "User created successfully",
      user: { id: this.lastID, email },
    });
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const sql = `SELECT id, password FROM users WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ user_ID: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("login successful");
    res.json({ token });
  });
}

async function getMe(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = { register, login, getMe };
