const express = require("express");
const router = express.Router();
var cLiquidityService = require("../services/cLiquidityHandler");

router.get("/getinfo/", function (req, res) {
  cLiquidityService.getInfo(req, res);
});

router.get("/getuserinfo/:pid/:userAddress", function (req, res) {
  cLiquidityService.getUserInfo(req, res);
});

router.get("/getpoolinfo/:pid", function (req, res) {
  cLiquidityService.getPoolInfo(req, res);
});

module.exports = router;
