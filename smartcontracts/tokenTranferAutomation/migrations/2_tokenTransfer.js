const fs = require("fs");
const ProximaToken = artifacts.require("ProximaToken");
const ProximaVault = artifacts.require("ProximaVault");

module.exports = async function (_network, addresses) {
  const [admin, _] = addresses;

  // Enter Contract Address

  const pxaToken = "0x086b098699A219903F5a7Df526Ba2874f1637f30";
  const pxaVault = "0x7ee965FF6c645eFC9026C5F6b04d8a2008707733";
  const proximaContributedLiquidity =
    "0x02Cf88c64a4C9cEDe780B32B9e017Ee3D61897a9";
  const proximaRewardVault = "0xB761CDEb75746345c398b394A3E88443d368cC6C";
  const proximaTeamToken = "0x234bFC42323Fc8F840FE226E57D6Ef13F36CeA2e";
  const proximaFaucet = "0xb2BDfc5305eBc320be2B43C380B9C645CBd1E467";
  const proximaBootstrap = "0x690a4f012C626339083c5a920e3f767152737316";

  const proximaContributedLiquidityPurpose =
    "0x70726f78696d61436f6e74726962757465644c69717569646974790000000000"; //proximaContributedLiquidity
  const proximaRewardVaultPurpose =
    "0x70726f78696d614c697175696469747926557365725265776172640000000000"; //proximaLiquidity&UserReward
  const proximaTeamTokenpurpose =
    "0x70726f78696d615465616d546f6b656e00000000000000000000000000000000"; //proximaTeamToken
  const proximaFaucetPurpose =
    "0x41637469766974793a70726f78696d6146617563657400000000000000000000"; //Activity:proximaFaucet
  const proximaBootstrapPurpose =
    "0x70726f78696d61426f6f74737472617000000000000000000000000000000000"; //proximaBootstrap

  const proximaContributedLiquidityAlloc = "1000000000000000000000000"; //1M pxa
  const proximaRewardVaultAlloc = "4750000000000000000000000"; //4.75M pxa
  const proximaTeamTokenAlloc = "800000000000000000000000"; //0.8M pxa
  const proximaFaucetAlloc = "90000000000000000000000"; // 0.09M pxa
  const proximaBootstrapAlloc = "10000000000000000000000"; //0.001M pxa

  //Instantiate pxaVault
  const proximaVault = await ProximaVault.at(pxaVault);

  const proximaToken = await ProximaToken.at(pxaToken);

  let initialVaultBalance = await proximaToken.balanceOf(proximaVault.address);

  //Token Transfer
  let pcl = await proximaVault.release(
    proximaContributedLiquidity,
    proximaContributedLiquidityAlloc,
    proximaContributedLiquidityPurpose
  );
  console.log("token transferred:pcl", pcl);

  let prv = await proximaVault.release(
    proximaRewardVault,
    proximaRewardVaultAlloc,
    proximaRewardVaultPurpose
  );
  console.log("token transferred:prv", prv);

  let ptt = await proximaVault.release(
    proximaTeamToken,
    proximaTeamTokenAlloc,
    proximaTeamTokenpurpose
  );
  console.log("token transferred:ptt", ptt);

  let pf = await proximaVault.release(
    proximaFaucet,
    proximaFaucetAlloc,
    proximaFaucetPurpose
  );
  console.log("token transferred:pf", pf);

  let pbs = await proximaVault.release(
    proximaBootstrap,
    proximaBootstrapAlloc,
    proximaBootstrapPurpose
  );
  console.log("token transferred:pbs", pbs);

  let pcsBalance = await proximaToken.balanceOf(proximaContributedLiquidity);

  let prvBalance = await proximaToken.balanceOf(proximaRewardVault);

  let pttBalance = await proximaToken.balanceOf(proximaTeamToken);

  let pfBalance = await proximaToken.balanceOf(proximaFaucet);

  let pbsBalance = await proximaToken.balanceOf(proximaBootstrap);

  let finalVaultBalance = await proximaToken.balanceOf(proximaVault.address);

  var deploymentDic = {
    initialVaultBalance: initialVaultBalance,
    finalVaultBalance: finalVaultBalance,
    pcsBalance: pcsBalance,
    prvBalance: prvBalance,
    pttBalance: pttBalance,
    pfBalance: pfBalance,
    pbsBalance: pbsBalance,
  };

  var deploymentDicString = JSON.stringify(deploymentDic);
  fs.writeFile(
    "MainProximaTokenTranfer.json",
    deploymentDicString,
    function (err, result) {
      if (err) console.log("error", err);
    }
  );
};
