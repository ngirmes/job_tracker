// Import Express framework
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
// const helmet = require('helmet')
const { rateLimit } = require("express-rate-limit");

/* If app is in production stage, use helmet for extra security
if(process.env.NODE_ENV === 'production') {
    app.use(helmet)
} */

app.use(cors());

// Basic rate limiting using express' rate limiter
rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

const myLogger = require("./middleware/myLogger");
app.use(myLogger);

app.use("/auth", require("./routes/auth.routes"));
app.use("/jobs", require("./routes/jobs.routes"));

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
