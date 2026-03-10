const express = require("express");
const router = express.Router();

const {
  getJobs,
  postJob,
  patchJob,
  deleteJob,
  searchAds,
} = require("../controllers/jobsController");

const authenticateToken = require("../middleware/authenticateToken");
const jsonParser = require("../middleware/jsonParser");
const validateUserExists = require("../middleware/validateUserExists");
const validateParamStatus = require("../middleware/validateParamStatus");

router.get("/", authenticateToken, getJobs);

router.get("/ads", authenticateToken, searchAds);
// Create a new job for a specific user
router.post("/", authenticateToken, jsonParser, validateParamStatus, postJob);
// Update a job’s status
router.patch(
  "/:id",
  authenticateToken,
  jsonParser,
  validateParamStatus,
  patchJob,
);
// Delete a job by ID
router.delete("/:id", authenticateToken, jsonParser, deleteJob);

module.exports = router;
