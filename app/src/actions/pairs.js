import { Types } from "./types";
import axios from "axios";
import { API_URL } from "../components/global/constants";

export const Pairs = {
  getActivePairs,
  getVotes,
  getFinishedPairs,
};

function getActivePairs(address, pageNumber) {
  return async (dispatch) => {
    try {
      const targURL =
        API_URL + "governance/getactivepairs/" + address + "/" + pageNumber;
      let _response = await axios.get(targURL);
      let _result = _response.data.response;
      console.log("active pairs info", _result);
      dispatch(setActivePairs(_result));
    } catch (err) {
      console.log(err);
    }
  };
}

function getFinishedPairs(address, pageNumber) {
  return async (dispatch) => {
    try {
      const targURL =
        API_URL + "governance/getfinishedpairs/" + address + "/" + pageNumber;
      let _response = await axios.get(targURL);
      let _result = _response.data.response;
      console.log("finished pairs info", _result);
      dispatch(setFinishedPairs(_result));
    } catch (err) {
      console.log(err);
    }
  };
}

function getVotes(address) {
  return async (dispatch) => {
    try {
      let _response = await axios.get(
        API_URL + "governance/getvotes/" + address
      );
      let _result = _response.data.response;
      console.log("_result", _result);
      dispatch(setVotes(_result));
    } catch (err) {
      console.log(err);
    }
  };
}

function setVotes(value) {
  return { type: Types.GET_VOTES, value: value };
}
function setActivePairs(value) {
  return { type: Types.GET_ACTIVE_PAIRS, value: value };
}
function setFinishedPairs(value) {
  return { type: Types.GET_FINISHED_PAIRS, value: value };
}
