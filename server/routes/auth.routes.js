const express = require("express");
// Import database connection (SQLite)
const router = express.Router();
const { rateLimit } = require("express-rate-limit");

loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
});

const { register, login, getMe } = require("../controllers/authController");
const jsonParser = require("../middleware/jsonParser");
const checkValidEmail = require("../middleware/checkValidEmail");
const validateAndHashPassword = require("../middleware/validateAndHashPassword");
const authenticateToken = require("../middleware/authenticateToken");

router.post(
  "/register",
  jsonParser,
  checkValidEmail,
  validateAndHashPassword,
  register,
);
router.post("/login", loginLimit, jsonParser, login);
router.get("/me", authenticateToken, getMe);

module.exports = router;
