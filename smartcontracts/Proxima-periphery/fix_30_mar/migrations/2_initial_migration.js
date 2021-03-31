const fs = require("fs");
const Router = artifacts.require("UniswapV2Router02");
const Factory = artifacts.require("IUniswapV2Factory");
const ProximaContributedLiquidity = artifacts.require(
  "ProximaContributedLiquidity"
);
const ProximaRewardVault = artifacts.require("ProximaLiquidityRewardVault");

module.exports = async function (deployer, _network, addresses) {
  const [admin, _] = addresses;

  const pxa = "0x086b098699A219903F5a7Df526Ba2874f1637f30";
  const wBNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";

  const factoryAddr = "0x642E7fb78A719133f15A73E14ac5801048aD79Bc";
  const rewardVaultAddr = "0xB761CDEb75746345c398b394A3E88443d368cC6C";
  const cLiquidityAddr = "0x02Cf88c64a4C9cEDe780B32B9e017Ee3D61897a9";

  const factory = await Factory.at(factoryAddr);
  const proximaContributedLiquidity = await ProximaContributedLiquidity.at(
    cLiquidityAddr
  );
  const proximaRewardVault = await ProximaRewardVault.at(rewardVaultAddr);

  await deployer.deploy(
    Router,
    factory.address,
    wBNB,
    proximaRewardVault.address
  );
  const router = await Router.deployed();

  await proximaContributedLiquidity.setRouter(router.address);
  await proximaRewardVault.setRouter(router.address);
  await factory.setRouter(router.address);

  var deploymentDic = {
    deployer: admin,
    router: router.address,
  };

  var deploymentDicString = JSON.stringify(deploymentDic);
  fs.writeFile(
    "MainProximaPeripheryDeployment.json",
    deploymentDicString,
    function (err, result) {
      if (err) console.log("error", err);
    }
  );
};
