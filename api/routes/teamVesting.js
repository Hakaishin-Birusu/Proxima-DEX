const express = require("express");
const router = express.Router();
var teamvestingService = require("../services/teamVesting_handler");

router.get("/getvestingdata/", function (req, res) {
  teamvestingService.getAggregateVestingData(req, res);
});

router.get("/vestingdetails/:userAddress", function (req, res) {
  teamvestingService.vestingDetail(req, res);
});

module.exports = router;
