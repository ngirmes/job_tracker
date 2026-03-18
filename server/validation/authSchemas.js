const { z } = require("zod");

const authSchema = z.object({
  email: z.email(),
  password: z.string(),
});

module.exports = { authSchema };
