const watcher = require("../contracts/ProximaWatcher.json");
const pxaConfig = require("../contracts/ProximaToken.json");
const rewardVaultConfig = require("../contracts/LiquidityRewardVault.json");
const network = require("../config/chainConfig");
const WEB3 = require("web3");

async function getSwapRewards(req, res) {
  try {
    const user = req.params.userAddress;
    var response = {
      balance: 0,
      claimableBalance: 0,
    };
    const web3 = new WEB3(network.rpc);
    let pxaInstance = new web3.eth.Contract(
      pxaConfig.pxaAbi,
      pxaConfig.pxaAddress
    );

    var userBalance = await pxaInstance.methods.balanceOf(user).call();

    let rewardVaultInstance = new web3.eth.Contract(
      rewardVaultConfig.rewardVaultAbi,
      rewardVaultConfig.rewardVaultAddress
    );
    var userClaimableBalance = await rewardVaultInstance.methods
      .getUserPendingShares(user)
      .call();

    response.balance = parseFloat(
      web3.utils.fromWei(userBalance, "ether")
    ).toFixed(2);
    response.claimableBalance = parseFloat(
      web3.utils.fromWei(userClaimableBalance, "ether")
    ).toFixed(2);

    res.json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

async function getFaucetRewards(req, res) {
  try {
    const user = req.params.userAddress;
    var response = {
      counter: 0,
      faucetBalance: 0,
      currentTime: 0,
      nextClaimTime: 0,
    };

    const web3 = new WEB3(network.rpc);

    let watcherInstance = new web3.eth.Contract(
      watcher.watcherAbi,
      watcher.watcherAddress
    );

    var faucetInfo = await watcherInstance.methods.getFaucet(user).call();
    console.log("faucetInfo", faucetInfo);

    response.counter = faucetInfo.counter;
    response.faucetBalance = parseFloat(
      web3.utils.fromWei(faucetInfo.faucetBalance, "ether")
    ).toFixed(2);
    response.currentTime = faucetInfo.currentTime;
    response.nextClaimTime = faucetInfo.nextTime;

    res.json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports = {
  getSwapRewards,
  getFaucetRewards,
};
