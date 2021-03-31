import { Types } from "./types";
import axios from "axios";
import { API_URL } from "../components/global/constants";

export const Liquidity = {
  getLiquidityInfo,
  getUserInfoDetails,
  getPoolInfo,
};

function getLiquidityInfo() {
  return async (dispatch) => {
    try {
      let _res = await axios.get(API_URL + "cLiquidity/getinfo");
      let result = _res.data.response;
      dispatch(
        getInfo(
          result.tvl,
          result.pxaPrice,
          result.contributionLeft,
          result.totolContribution
        )
      );
    } catch (err) {}
  };
}

function getUserInfoDetails(type, address) {
  return async (dispatch) => {
    try {
      let _res = await axios.get(
        API_URL + "cLiquidity/getuserinfo/" + type + "/" + address
      );
      let _result = _res.data.response;
      console.log(_result);
      if (_result !== "No result found") {
        dispatch(setUserInfo(_result));
      } else {
        dispatch(setUserInfo([]));
      }
    } catch (err) {}
  };
}

function getPoolInfo(type) {
  return async (dispatch) => {
    try {
      dispatch({ type: Types.GET_POOL_INFO, value: "" });
      let _res = await axios.get(API_URL + "cLiquidity/getpoolinfo/" + type);
      let _result = _res.data.response;
      console.log("pool info", _result);
      dispatch(setPoolInfo(_result));
    } catch (err) {}
  };
}

// dispatch functions
function getInfo(tvl, pxa, contributionLeft, totalContribution) {
  return {
    type: Types.GET_LIQUIDITY_INFO,
    pxa: pxa,
    tvl: tvl,
    totalContribution: totalContribution,
    contributionLeft: contributionLeft,
  };
}

function setUserInfo(value) {
  return {
    type: Types.GET_USER_INFO_DETAILS,
    value: value,
  };
}

function setPoolInfo(value) {
  return {
    type: Types.GET_POOL_INFO,
    value: value,
  };
}
