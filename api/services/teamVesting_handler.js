const watcher = require("../contracts/ProximaWatcher.json");
const network = require("../config/chainConfig");
const message = require("../config/message");
const WEB3 = require("web3");

async function getAggregateVestingData(req, res) {
  try {
    //IMP: should start from vesting month
    var monthCounter = 1;
    var res_arr = [];
    var detailAggregation = {
      month: 0,
      totalVested: 0,
      totalClaimed: 0,
    };
    index = 0;
    next = true;
    const web3 = new WEB3(network.rpc);
    let watcherInstance = new web3.eth.Contract(
      watcher.watcherAbi,
      watcher.watcherAddress
    );
    while (next == true) {
      var vestingDetails = await watcherInstance.methods
        .getAllVestings(index)
        .call();
      for (i = 0; i < vestingDetails[0].length; i++) {
        var vestDate = new Date(vestingDetails[0][i].releaseTime * 1000);
        var vestMonth = vestDate.getMonth() + 1;
        if (monthCounter == vestMonth) {
          detailAggregation.month = monthCounter;
          detailAggregation.totalVested =
            detailAggregation.totalVested +
            parseInt(web3.utils.fromWei(vestingDetails[0][i].amount, "ether"));
          if (vestingDetails[0][i].released == true) {
            detailAggregation.totalClaimed =
              detailAggregation.totalClaimed +
              parseInt(
                web3.utils.fromWei(vestingDetails[0][i].amount, "ether")
              );
          }
        } else {
          res_arr.push({
            month: detailAggregation.month,
            tokenVested: detailAggregation.totalVested,
            tokenClaimed: detailAggregation.totalClaimed,
          });
          monthCounter = monthCounter + 1;
          detailAggregation.totalVested = 0;
          detailAggregation.totalClaimed = 0;
        }
      }

      index = index + parseInt(vestingDetails[0].length);
      next = vestingDetails[1];
    }
    res_arr.push({
      month: detailAggregation.month,
      tokenVested: detailAggregation.totalVested,
      tokenClaimed: detailAggregation.totalClaimed,
    });

    //Dummy data for testing, should be removed in prod
    for (i = 2; i <= 12; i++) {
      res_arr.push({
        month: i,
        tokenVested: Math.floor(Math.random() * 1000000 + 10000),
        tokenClaimed: Math.floor(Math.random() * 1000000 + 10000),
      });
    }
    if (res_arr.length > 0) {
      res.json({ response: res_arr });
    } else {
      res.json({ response: message.noTokenMultisendEvent });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

async function vestingDetail(req, res) {
  try {
    userAddress = req.params.userAddress;
    index = 0;
    next = true;
    var vestingResponse = {
      beneficiary: userAddress,
      startDate: "",
      endDate: "",
      totalVested: 0,
      vested: 0,
      released: 0,
      revocable: true,
    };
    const web3 = new WEB3(network.rpc);
    let watcherInstance = new web3.eth.Contract(
      watcher.watcherAbi,
      watcher.watcherAddress
    );

    while (next == true) {
      var vestingDetails = await watcherInstance.methods
        .getAllVestings(index)
        .call();
      for (i = 0; i < vestingDetails[0].length; i++) {
        if (
          vestingDetails[0][i].beneficiary.toLowerCase() ==
          userAddress.toLowerCase()
        ) {
          vestingResponse.startDate = vestingDetails[0][0].releaseTime;
          vestingResponse.endDate = vestingDetails[0][i].releaseTime;
          vestingResponse.totalVested =
            vestingResponse.totalVested +
            parseInt(web3.utils.fromWei(vestingDetails[0][i].amount, "ether"));
          if (vestingDetails[0][i].released == false) {
            vestingResponse.vested =
              vestingResponse.vested +
              parseInt(
                web3.utils.fromWei(vestingDetails[0][i].amount, "ether")
              );
          } else {
            vestingResponse.released =
              vestingResponse.released +
              parseInt(
                web3.utils.fromWei(vestingDetails[0][i].amount, "ether")
              );
          }
        }
      }
      index = index + parseInt(vestingDetails[0].length);
      next = vestingDetails[1];
    }

    if (vestingResponse != undefined || vestingResponse != null) {
      res.json({ response: vestingResponse });
    } else {
      res.json({ response: message.noEthMultisendEvent });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports = {
  getAggregateVestingData,
  vestingDetail,
};
