import { Types } from "../actions";

const initialState = {
  swapRewards: "",
  faucetRewards: "",
};

export const SWAP = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_SWAP_REWARDS:
      return {
        ...state,
        swapRewards: action.value,
      };

    case Types.GET_FAUCET_REWARDS:
      return {
        ...state,
        faucetRewards: action.value,
      };

    default:
      return state;
  }
};
