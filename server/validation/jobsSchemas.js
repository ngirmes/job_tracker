const { z, number } = require("zod");

const getJobsSchema = z.object({
  page: z.coerce.number().min(1),
  limit: z.coerce.number().max(50),
});
const postJobSchema = z.object({
  company: z.string(),
  role: z.string(),
  status: z.enum(["applied", "offer", "rejected", "interviewed"]),
  dateApplied: z.string(),
});

const patchStatusSchema = z.object({
  status: z.enum(["applied", "offer", "rejected", "interviewed"]),
});

const deleteJobSchema = z.object({
  id: z.coerce(number),
});

const getAdsSchema = z.object({
  what: z.string(),
  where: z.string(),
  distance: z.coerce().number(),
});
module.exports = {
  getJobsSchema,
  postJobSchema,
  patchStatusSchema,
  deleteJobSchema,
  getAdsSchema,
};
