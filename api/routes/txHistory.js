const express = require("express");
const router = express.Router();
var txHistoryService = require("../services/txHistory_handler");

router.post("/addHistory", function (req, res) {
  txHistoryService.AddHistory(req, res);
});

router.get("/getHistory/:userAddress", function (req, res) {
  txHistoryService.GetHistory(req, res);
});

module.exports = router;
