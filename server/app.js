// Import Express framework
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

// If app is in production stage, use helmet for extra security
if (process.env.NODE_ENV === "production") {
  app.use(helmet);
}

const logStream = fs.createWriteStream(path.join(__dirname, "server.log"), {
  flags: "a",
});

// Basic rate limiting using express' rate limiter
rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

// const myLogger = require("./middleware/myLogger");
// app.use(myLogger);

app.use(cors());
app.use(morgan("combined", { stream: logStream }));
app.get("/", (req, res) => {
  res.send("Hello from Express through Nginx 🚀");
});
app.use("/auth", require("./routes/auth.routes"));
app.use("/jobs", require("./routes/jobs.routes"));

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
