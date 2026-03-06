// Parses JSON request bodies and attaches them to req.body
// Demonstrates understanding; could also use built-in express.json()
function jsonParser(req, res, next) {
  // Only run for requests that SHOULD have a body
  let data = "";

  // Listen for chunks of data being sent
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    if (!data) {
      // No body sent, assign empty object
      req.body = {};
      return next();
    }

    try {
      // Parse JSON and attach to request object
      req.body = JSON.parse(data);
      next();
    } catch (err) {
      res.status(400).json({ error: "Invalid JSON" });
    }
  });
}

module.exports = jsonParser;
