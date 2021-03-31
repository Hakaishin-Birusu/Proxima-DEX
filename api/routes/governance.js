const express = require("express");
const router = express.Router();
var governanceService = require("../services/governanceHandler");

router.get("/getvotes/:userAddress", function (req, res) {
  governanceService.getVotes(req, res);
});

router.get("/getactivepairs/:userAddress/:pnum", function (req, res) {
  governanceService.getActivePairs(req, res);
});

router.get("/getfinishedpairs/:userAddress/:pnum", function (req, res) {
  governanceService.getFinishedPairs(req, res);
});

module.exports = router;
