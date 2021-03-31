const fs = require("fs");
const BBStorage = artifacts.require("BBStorage");
const Factory = artifacts.require("UniswapV2Factory");
const ProximaMaker = artifacts.require("ProximaMaker");
const ProximaFaucet = artifacts.require("ProximaFaucet");
const ProximaWatchDog = artifacts.require("ProximaWatchDog");
const ProximaGovernance = artifacts.require("ProximaPairGovernor");
const ProximaRewardVault = artifacts.require("ProximaLiquidityRewardVault");
const ProximaContributedLiquidity = artifacts.require(
  "ProximaContributedLiquidity"
);

module.exports = async function (deployer, _network, addresses) {
  const [admin, _] = addresses;

  const pxa = "0x086b098699A219903F5a7Df526Ba2874f1637f30";
  const wBNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
  const bDOT = "0x7083609fce4d1d8dc0c979aab8c869ea2c873402";
  const bBTC = "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c";
  const bETH = "0x2170ed0880ac9a755fd29b2688956bd959f933f8";
  const bUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
  const proximaTeamToken = "0x234bFC42323Fc8F840FE226E57D6Ef13F36CeA2e";

  await deployer.deploy(ProximaFaucet, pxa);
  const proximaFaucet = await ProximaFaucet.deployed();

  await deployer.deploy(ProximaContributedLiquidity, pxa, wBNB);
  const proximaContributedLiquidity = await ProximaContributedLiquidity.deployed();

  await deployer.deploy(ProximaRewardVault, pxa, admin);
  const proximaRewardVault = await ProximaRewardVault.deployed();

  await deployer.deploy(BBStorage, pxa);
  const bBStorage = await BBStorage.deployed();

  await deployer.deploy(Factory, admin, pxa, proximaRewardVault.address);
  const factory = await Factory.deployed();

  await deployer.deploy(
    ProximaGovernance,
    pxa,
    factory.address,
    proximaRewardVault.address
  );
  const proximaGovernance = await ProximaGovernance.deployed();

  await deployer.deploy(
    ProximaMaker,
    factory.address,
    bBStorage.address,
    pxa,
    wBNB
  );
  const proximaMaker = await ProximaMaker.deployed();

  await proximaRewardVault.setPairGovernor(proximaGovernance.address);
  await proximaRewardVault.setFactory(factory.address);

  await factory.setFeeTo(proximaMaker.address);
  await factory.setPairGovernor(proximaGovernance.address);
  await factory.createPair(pxa, wBNB, admin, false);
  await factory.createPair(pxa, bETH, admin, false);
  await factory.createPair(pxa, bBTC, admin, false);
  await factory.createPair(pxa, bUSD, admin, false);
  await factory.createPair(pxa, bDOT, admin, false);

  const initHash = await factory.pairCodeHash();

  await deployer.deploy(
    ProximaWatchDog,
    proximaTeamToken,
    proximaGovernance.address,
    proximaFaucet.address
  );
  const proximaWatchDog = await ProximaWatchDog.deployed();

  var deploymentDic = {
    pxa: pxa,
    WBNB: wBNB,
    deployer: admin,
    BBStorage: bBStorage.address,
    proximaFaucet: proximaFaucet.address,
    proximaFactory: factory.address,
    proximaMaker: proximaMaker.address,
    proximaWatchDog: proximaWatchDog.address,
    proximaTeamToken: proximaTeamToken,
    proximaGovernance: proximaGovernance.address,
    proximaRewardVault: proximaRewardVault.address,
    proximaContributedLiquidity: proximaContributedLiquidity.address,
    initHash: initHash,
  };

  var deploymentDicString = JSON.stringify(deploymentDic);
  fs.writeFile(
    "MainProximaCoreDeployment.json",
    deploymentDicString,
    function (err, result) {
      if (err) console.log("error", err);
    }
  );
};
