const express = require("express");
const router = express.Router();
var rewardService = require("../services/rewardHandler");

router.get("/getswaprewards/:userAddress", function (req, res) {
  rewardService.getSwapRewards(req, res);
});

router.get("/getfaucetrewards/:userAddress", function (req, res) {
  rewardService.getFaucetRewards(req, res);
});

module.exports = router;
