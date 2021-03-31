const fs = require("fs");
const ProximaTeamToken = artifacts.require("ProximaTeamTokenVesting");

module.exports = async function (deployer, _network, addresses) {
  const [admin, _] = addresses;

  const pxaToken = "0x086b098699A219903F5a7Df526Ba2874f1637f30";

  await deployer.deploy(ProximaTeamToken, pxaToken);
  const proximaTeamToken = await ProximaTeamToken.deployed();

  console.log("deployed bulk vest", proximaTeamToken.address);

  var deploymentDic = {
    deployer: admin,
    proximaToken: pxaToken,
    proximaTeamToken: proximaTeamToken.address,
  };

  var deploymentDicString = JSON.stringify(deploymentDic);
  fs.writeFile(
    "MainProximaTeamTokenDeployment.json",
    deploymentDicString,
    function (err, result) {
      if (err) console.log("error", err);
    }
  );
};
