import StakingABI from "../helpers/abi/staking.json";
import SwapABIJSON from "../helpers/abi/swap.json";
import GovernanceABIJSON from "../helpers/abi/governance.json";
import FaucetABIJSON from "../helpers/abi/faucet.json";
import PxaABIJSON from "../helpers/abi/pxa.json";

export const contract = {
  RPCURL: "https://bsc-dataseed1.defibit.io/",

  StakingContractAddress: "0x02Cf88c64a4C9cEDe780B32B9e017Ee3D61897a9", //cL
  StakingABI: StakingABI,

  SwapRewardsAddress: "0xB761CDEb75746345c398b394A3E88443d368cC6C", //RewardVault
  SwapABI: SwapABIJSON,

  GovernnceAddress: "0x1A1F3AdA8674896B8e312BF260A390E24A7b6a9A",
  GovernanceABI: GovernanceABIJSON,

  FaucetAddress: "0xb2BDfc5305eBc320be2B43C380B9C645CBd1E467",
  FaucetABI: FaucetABIJSON,

  PxaAddress: "0x086b098699A219903F5a7Df526Ba2874f1637f30",
  PxaABI: PxaABIJSON,
};
