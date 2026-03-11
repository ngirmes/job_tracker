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
const validate = require("../validation/validation");
const {
  getJobsSchema,
  postJobSchema,
  patchStatusSchema,
  deleteJobSchema,
  getAdsSchema,
} = require("../validation/jobsSchemas");

router.get("/", authenticateToken, validate(getJobsSchema), getJobs);

router.get("/ads", authenticateToken, validate(getAdsSchema), searchAds);
// Create a new job for a specific user
router.post(
  "/",
  authenticateToken,
  jsonParser,
  validate(postJobSchema),
  postJob,
);
// Update a job’s status
router.patch(
  "/:id",
  authenticateToken,
  jsonParser,
  validate(patchStatusSchema),
  patchJob,
);
// Delete a job by ID
router.delete(
  "/:id",
  authenticateToken,
  validate(deleteJobSchema),
  jsonParser,
  deleteJob,
);

module.exports = router;
