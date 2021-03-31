const watcher = require("../contracts/ProximaWatcher.json");
const cLiquidityConfig = require("../contracts/ProximaContributedLiquidity.json");
const pxaConfig = require("../contracts/ProximaToken.json");
const routerConfig = require("../contracts/router.json");
const network = require("../config/chainConfig");
const WEB3 = require("web3");
const axios = require("axios");

async function getInfo(req, res) {
  try {
    axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=wbnb%2Cethereum%2Cbitcoin%2Cbusd%2Cpolkadot&vs_currencies=usd%2Cusd%2Cusd%2Cusd%2Cusd"
      )
      .then(async (response) => {
        var onePxa = "1000000000000000000";
        var baseTokens = [];
        var organisedPrices = [];
        var totalValueLocked = 0;
        var aggPrice = 0;
        var infoResponse = {
          tvl: 0,
          totolContribution: 0,
          contributionLeft: 0,
          pxaPrice: 0,
        };

        organisedPrices.push(response.data.wbnb.usd);
        organisedPrices.push(response.data.ethereum.usd);
        organisedPrices.push(response.data.busd.usd);
        organisedPrices.push(response.data.bitcoin.usd);
        organisedPrices.push(response.data.polkadot.usd);
        console.log("organisedPrices", organisedPrices);

        const web3 = new WEB3(network.rpc);
        let cLiquidityInstance = new web3.eth.Contract(
          cLiquidityConfig.cLiquidityAbi,
          cLiquidityConfig.cLiquidityAddress
        );

        var resGetInfo = await cLiquidityInstance.methods.getStat().call();
        infoResponse.totolContribution = web3.utils.fromWei(
          resGetInfo[0],
          "ether"
        );
        infoResponse.contributionLeft = web3.utils.fromWei(
          resGetInfo[1],
          "ether"
        );

        for (var i = 0; i < 5; i++) {
          var resPairDetails = await cLiquidityInstance.methods
            .getPoolStat(i)
            .call();
          baseTokens.push(resPairDetails.baseToken);
          totalValueLocked =
            totalValueLocked +
            web3.utils.fromWei(resPairDetails.depositedBaseToken, "ether") *
              organisedPrices[i];
        }
        console.log("info responsw", infoResponse);

        let routerInstance = new web3.eth.Contract(
          routerConfig.routerAbi,
          routerConfig.routerAddress
        );
        console.log("baseTokens", baseTokens);
        for (var i = 0; i < 5; i++) {
          var resPriceDetails = await routerInstance.methods
            .getAmountsOut(onePxa, [pxaConfig.pxaAddress, baseTokens[i]])
            .call();

          console.log("resPriceDetails", resPriceDetails[1]);
          aggPrice =
            aggPrice +
            web3.utils.fromWei(resPriceDetails[1], "ether") *
              organisedPrices[i];
        }

        aggPrice = aggPrice / 5;
        console.log("aggPrice", aggPrice);
        infoResponse.pxaPrice = aggPrice.toFixed(2);

        infoResponse.tvl = (
          totalValueLocked +
          infoResponse.totolContribution * infoResponse.pxaPrice
        ).toFixed(2);
        res.json({ response: infoResponse });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

async function getUserInfo(req, res) {
  try {
    const user = req.params.userAddress;
    const pid = req.params.pid;
    var resArray = [];
    let wButton = false;

    const web3 = new WEB3(network.rpc);
    let cLiquidityInstance = new web3.eth.Contract(
      cLiquidityConfig.cLiquidityAbi,
      cLiquidityConfig.cLiquidityAddress
    );
    let watcherInstance = new web3.eth.Contract(
      watcher.watcherAbi,
      watcher.watcherAddress
    );

    var cTime = await watcherInstance.methods.getCurrentTimestamp().call();
    //console.log("current time", cTime);
    var resUserDetails = await cLiquidityInstance.methods
      .getUserStat(pid, user)
      .call();

    //console.log("resUserDetails", resUserDetails);
    if (resUserDetails.length <= 0) {
      res.json({ response: "No result found" });
    } else {
      for (var i = 0; i < resUserDetails.length; i++) {
        let liquidityToken = web3.utils.fromWei(
          resUserDetails[i].liquidity,
          "ether"
        );
        let depositedBaseToken = web3.utils.fromWei(
          resUserDetails[i].depositedBaseToken,
          "ether"
        );
        let contributionReceived = web3.utils.fromWei(
          resUserDetails[i].contributionReceived,
          "ether"
        );

        if (
          parseFloat(cTime) > parseFloat(resUserDetails[i].unlockTime) &&
          resUserDetails[i].withdrawn == false
        ) {
          wButton = true;
        }

        resArray.push({
          uid: i,
          liquidityToken: liquidityToken,
          depositedBaseToken: depositedBaseToken,
          contributionReceived: contributionReceived,
          depositTime: resUserDetails[i].depositTime,
          unlockTime: resUserDetails[i].unlockTime,
          withdrawn: resUserDetails[i].withdrawn,
          currentTime: cTime,
          withdrawButton: wButton,
        });
        wButton = false;
      }
      res.json({ response: resArray });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

async function getPoolInfo(req, res) {
  try {
    const pid = req.params.pid;
    if (pid >= 5) {
      res.json({ response: "No result found" });
    }
    var response = {
      lpToken: "",
      pxaAddress: pxaConfig.pxaAddress,
      baseTokenAddress: "",
      allocPxa: 0,
      contributedPxa: 0,
      depositedBaseToken: 0,
      lockPeriod: "30 days",
      maxDeposit: 0,
      currentTime: 0,
    };
    const web3 = new WEB3(network.rpc);
    let cLiquidityInstance = new web3.eth.Contract(
      cLiquidityConfig.cLiquidityAbi,
      cLiquidityConfig.cLiquidityAddress
    );

    let watcherInstance = new web3.eth.Contract(
      watcher.watcherAbi,
      watcher.watcherAddress
    );

    var cTime = await watcherInstance.methods.getCurrentTimestamp().call();
    console.log("current time", cTime);

    var resPoolDetails = await cLiquidityInstance.methods
      .getPoolStat(pid)
      .call();

    console.log("resPoolDetails", resPoolDetails);
    response.lpToken = resPoolDetails.lpToken;
    response.baseTokenAddress = resPoolDetails.baseToken;
    response.allocPxa = web3.utils.fromWei(resPoolDetails.allocPxa, "ether");
    response.contributedPxa = web3.utils.fromWei(
      resPoolDetails.contributedPxa,
      "ether"
    );
    response.depositedBaseToken = web3.utils.fromWei(
      resPoolDetails.depositedBaseToken,
      "ether"
    );

    response.currentTime = cTime;

    let contributionLeftRaw = (
      response.allocPxa - response.contributedPxa
    ).toString();
    let contributionLeft = web3.utils.toWei(contributionLeftRaw, "ether");

    console.log("response.allocPxa", response.allocPxa);
    console.log("response.contributedPxa", response.contributedPxa);
    console.log("contributionLeft", contributionLeft);

    let routerInstance = new web3.eth.Contract(
      routerConfig.routerAbi,
      routerConfig.routerAddress
    );

    var maxContribution = await routerInstance.methods
      .getOptimalAmount(
        pxaConfig.pxaAddress,
        response.baseTokenAddress,
        contributionLeft
      )
      .call();

    console.log("maxContribution", maxContribution);

    response.maxDeposit = web3.utils.fromWei(maxContribution.amountB, "ether");

    res.json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports = {
  getInfo,
  getUserInfo,
  getPoolInfo,
};
