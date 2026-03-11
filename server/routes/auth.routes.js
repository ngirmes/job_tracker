const express = require("express");
// Import database connection (SQLite)
const router = express.Router();
const { rateLimit } = require("express-rate-limit");

authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    error: 'Too many requests. Please try again later.'
  }
});

const { register, login, getMe } = require("../controllers/authController");
const jsonParser = require("../middleware/jsonParser");
const checkUserExists = require("../middleware/checkUserExists");
const validateAndHashPassword = require("../middleware/validateAndHashPassword");
const authenticateToken = require("../middleware/authenticateToken");

router.post(
  "/register", 
  authLimit,
  jsonParser,
  checkUserExists,
  validateAndHashPassword,
  register,
);
router.post("/login", authLimit, jsonParser, login);
router.get("/me", authenticateToken, getMe);

module.exports = router;
