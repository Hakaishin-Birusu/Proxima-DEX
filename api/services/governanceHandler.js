const watcher = require("../contracts/ProximaWatcher.json");
const pxaConfig = require("../contracts/ProximaToken.json");
const network = require("../config/chainConfig");
const WEB3 = require("web3");

async function getVotes(req, res) {
  try {
    const user = req.params.userAddress;
    var response = {
      balance: 0,
      votes: 0,
      currentBlock: 0,
      challengeThreshold: 100000,
    };
    const web3 = new WEB3(network.rpc);
    let pxaInstance = new web3.eth.Contract(
      pxaConfig.pxaAbi,
      pxaConfig.pxaAddress
    );
    let watcherInstance = new web3.eth.Contract(
      watcher.watcherAbi,
      watcher.watcherAddress
    );

    var userBalance = await pxaInstance.methods.balanceOf(user).call();
    var userVotes = await pxaInstance.methods.getCurrentVotes(user).call();

    var cBlock = await watcherInstance.methods.getCurrentBlock().call();

    response.balance = parseFloat(
      web3.utils.fromWei(userBalance, "ether")
    ).toFixed(3);
    response.votes = parseFloat(web3.utils.fromWei(userVotes, "ether")).toFixed(
      3
    );
    response.currentBlock = cBlock;

    res.json({ response: response });
  } catch (err) {
    console.log(err);

    res.json({ response: "No result found" });
  }
}

async function getActivePairs(req, res) {
  try {
    const pnum = req.params.pnum;
    const user = req.params.userAddress;

    var activeArray = [];

    var finalResponse = [];
    const web3 = new WEB3(network.rpc);
    let watcherInstance = new web3.eth.Contract(
      watcher.watcherAbi,
      watcher.watcherAddress
    );

    var activeIds = await watcherInstance.methods
      .getAllActivePairs(pnum)
      .call();

    for (var i = 0; i < 5; i++) {
      if (activeIds[i] != 0) {
        activeArray.push(activeIds[i]);
      }
    }
    console.log("Active ID Array", activeArray);

    if (activeArray.length > 0) {
      var proposalData = await watcherInstance.methods
        .getActiveProposals(activeArray, user)
        .call();

      console.log("proposalData", proposalData);

      for (j = 0; j < proposalData[0].length; j++) {
        let vStatus = "Loosing";
        if (
          proposalData[0][j].forVotes == 0 &&
          proposalData[0][j].againstVotes == 0
        ) {
          vStatus = "No Vote";
        } else if (
          proposalData[0][j].forVotes > proposalData[0][j].againstVotes
        ) {
          vStatus = "Winning";
        }

        let pairSymbol =
          proposalData[0][j].token0Sym + "/" + proposalData[0][j].token1Sym;

        finalResponse.push({
          id: proposalData[0][j].id,
          proposer: proposalData[0][j].proposer,
          pair: proposalData[0][j].pair,
          token0: proposalData[0][j].token0,
          token1: proposalData[0][j].token1,
          pairName: pairSymbol,
          startBlock: proposalData[0][j].startBlock,
          endBlock: proposalData[0][j].endBlock,
          pairStatus: vStatus,
          forVotes: parseFloat(
            web3.utils.fromWei(proposalData[0][j].forVotes, "ether")
          ).toFixed(3),
          againstVotes: parseFloat(
            web3.utils.fromWei(proposalData[0][j].againstVotes, "ether")
          ).toFixed(3),
          hasVoted: proposalData[1][j].hasVoted,
          support: proposalData[1][j].support,
          votes: parseFloat(
            web3.utils.fromWei(proposalData[1][j].votes, "ether")
          ).toFixed(3),
        });
      }
      console.log("finalResponse", finalResponse);
      if (finalResponse.length > 0) {
        res.json({ response: finalResponse });
      } else {
        res.json({ response: "No result found" });
      }
    } else {
      res.json({ response: "No result found" });
    }
  } catch (err) {
    console.log(err);
    res.json({ response: "No result found" });
  }
}

async function getFinishedPairs(req, res) {
  try {
    const pnum = req.params.pnum;
    const user = req.params.userAddress;

    var finishedArray = [];

    var finalResponse = [];
    const web3 = new WEB3(network.rpc);
    let watcherInstance = new web3.eth.Contract(
      watcher.watcherAbi,
      watcher.watcherAddress
    );

    var nonActiveIds = await watcherInstance.methods
      .getAllNonActivePairs(pnum)
      .call();

    for (var i = 0; i < 5; i++) {
      if (nonActiveIds[i] != 0) {
        finishedArray.push(nonActiveIds[i]);
      }
    }
    console.log("Finished Id Array", finishedArray);

    if (finishedArray.length > 0) {
      var proposalData = await watcherInstance.methods
        .getFinishedProposals(finishedArray, user)
        .call();

      // console.log("proposalData", proposalData[2][2]);

      for (j = 0; j < proposalData[0].length; j++) {
        let pairSymbol =
          proposalData[0][j].token0Sym + "/" + proposalData[0][j].token1Sym;

        finalResponse.push({
          id: proposalData[0][j].id,
          proposer: proposalData[0][j].proposer,
          pair: proposalData[0][j].pair,
          pairName: pairSymbol,
          token0: proposalData[0][j].token0,
          token1: proposalData[0][j].token1,
          startBlock: proposalData[0][j].startBlock,
          endBlock: proposalData[0][j].endBlock,
          forVotes: parseFloat(
            web3.utils.fromWei(proposalData[0][j].forVotes, "ether")
          ).toFixed(3),
          againstVotes: parseFloat(
            web3.utils.fromWei(proposalData[0][j].againstVotes, "ether")
          ).toFixed(3),
          hasVoted: proposalData[1][j].hasVoted,
          support: proposalData[1][j].support,
          votes: parseFloat(
            web3.utils.fromWei(proposalData[1][j].votes, "ether")
          ).toFixed(3),
          pairStatus: proposalData[2][j],
        });
      }
      if (finalResponse.length > 0) {
        res.json({ response: finalResponse });
      } else {
        res.json({ response: "No result found" });
      }
    } else {
      res.json({ response: "No result found" });
    }
  } catch (err) {
    console.log(err);

    res.json({ response: "No result found" });
  }
}

module.exports = {
  getVotes,
  getActivePairs,
  getFinishedPairs,
};
