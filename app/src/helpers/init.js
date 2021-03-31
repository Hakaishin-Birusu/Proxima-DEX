import Web3 from "web3";
import { contract } from "../common/contractconfig";


const web3 = new Web3(contract.RPCURL);


function contractInit(abi, address) {
    return new web3.eth.Contract(abi, address);
}

export const Init = () => {
    const Instance = contractInit(contract.StakingABI, contract.StakingContractAddress);
    return Instance;
}




