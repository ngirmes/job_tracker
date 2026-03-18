const { z } = require("zod");

const authSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

module.exports = { authSchema };
