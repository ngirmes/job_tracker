const { z } = require("zod");

const paginationSchema = z.object({
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

const jobIDSchema = z.object({
  id: z.coerce.number(),
});

const getAdsSchema = z.object({
  what: z.string(),
  where: z.string(),
  distance: z.coerce.number(),
});
module.exports = {
  paginationSchema,
  postJobSchema,
  patchStatusSchema,
  jobIDSchema,
  getAdsSchema,
};
