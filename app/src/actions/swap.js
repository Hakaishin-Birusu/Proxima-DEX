import { Types } from "./types";
import axios from "axios";
import { API_URL } from "../components/global/constants";

export const SWAP = {
  getSwapRewards,
  getFaucetRewards,
};

function getSwapRewards(address) {
  return async (dispatch) => {
    try {
      console.log("dispatching swap rewards for:", address);
      let _response = await axios.get(
        API_URL + "rewards/getswaprewards/" + address
      );
      let _result = _response.data.response;
      console.log(_result);
      dispatch(setSwapRewards(_result));
    } catch (err) {
      console.log(err);
    }
  };
}

function getFaucetRewards(address) {
  return async (dispatch) => {
    try {
      console.log("dispatching faucet rewards for:", address);
      let _response = await axios.get(
        API_URL + "rewards/getfaucetrewards/" + address
      );
      let _result = _response.data.response;
      console.log(_result);
      dispatch(setFaucetRewards(_result));
    } catch (err) {
      console.log(err);
    }
  };
}

function setSwapRewards(value) {
  return { type: Types.GET_SWAP_REWARDS, value: value };
}

function setFaucetRewards(value) {
  return { type: Types.GET_FAUCET_REWARDS, value: value };
}
