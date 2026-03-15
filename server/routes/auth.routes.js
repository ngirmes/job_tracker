const express = require("express");
// Import database connection (SQLite)
const router = express.Router();
const { rateLimit } = require("express-rate-limit");

authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    error: "Too many requests. Please try again later.",
  },
});

const { register, login, getMe } = require("../controllers/authController");
const jsonParser = require("../middleware/jsonParser");
const checkUserExists = require("../middleware/checkUserExists");
const hashPassword = require("../middleware/hashPassword");
const authenticateToken = require("../middleware/authenticateToken");
const validate = require("../validation/validation");
const { authSchema } = require("../validation/authSchemas");

router.post(
  "/register",
  authLimit,
  jsonParser,
  validate(authSchema),
  checkUserExists,
  hashPassword,
  register,
);
router.post("/login", authLimit, jsonParser, validate(authSchema), login);
router.get("/me", authenticateToken, getMe);

module.exports = router;
