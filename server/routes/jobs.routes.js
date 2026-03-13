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
  paginationSchema,
  postJobSchema,
  patchStatusSchema,
  jobIDSchema,
  getAdsSchema,
} = require("../validation/jobsSchemas");

router.get(
  "/",
  authenticateToken,
  validate(paginationSchema, "query"),
  getJobs,
);

router.get(
  "/ads",
  authenticateToken,
  validate(getAdsSchema, "query"),
  searchAds,
);
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
  validate(jobIDSchema, "params"),
  validate(patchStatusSchema),
  patchJob,
);
// Delete a job by ID
router.delete(
  "/:id",
  authenticateToken,
  jsonParser,
  validate(jobIDSchema, "params"),
  deleteJob,
);

module.exports = router;
