const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.json({ result: "/Get/:Sucess/" });
});

module.exports = router;
