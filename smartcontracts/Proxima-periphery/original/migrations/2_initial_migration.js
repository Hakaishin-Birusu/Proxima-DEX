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
  const bDOT = "0x7083609fce4d1d8dc0c979aab8c869ea2c873402";
  const bBTC = "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c";
  const bETH = "0x2170ed0880ac9a755fd29b2688956bd959f933f8";
  const bUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

  const factoryAddr = "0x642E7fb78A719133f15A73E14ac5801048aD79Bc";
  const rewardVaultAddr = "0xB761CDEb75746345c398b394A3E88443d368cC6C";
  const cLiquidityAddr = "0x02Cf88c64a4C9cEDe780B32B9e017Ee3D61897a9";

  const allocPxa = "200000000000000000000000";

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

  const bnbPair = await factory.getPair(pxa, wBNB);
  const ethPair = await factory.getPair(pxa, bETH);
  const busdPair = await factory.getPair(pxa, bUSD);
  const btcPair = await factory.getPair(pxa, bBTC);
  const dotPair = await factory.getPair(pxa, bDOT);

  await proximaContributedLiquidity.addContributedLiquidityPair(
    bnbPair,
    wBNB,
    allocPxa
  );
  await proximaContributedLiquidity.addContributedLiquidityPair(
    ethPair,
    bETH,
    allocPxa
  );
  await proximaContributedLiquidity.addContributedLiquidityPair(
    busdPair,
    bUSD,
    allocPxa
  );
  await proximaContributedLiquidity.addContributedLiquidityPair(
    btcPair,
    bBTC,
    allocPxa
  );
  await proximaContributedLiquidity.addContributedLiquidityPair(
    dotPair,
    bDOT,
    allocPxa
  );

  await proximaRewardVault.setRouter(router.address);

  var deploymentDic = {
    deployer: admin,
    router: router.address,
    PAIRS: "====================================================",
    bnbPair: bnbPair,
    ethPair: ethPair,
    btcPair: btcPair,
    busdPair: busdPair,
    dotPair: dotPair,
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
