import { Types } from "../actions";

const initialState = {
    PXAValue: 0,
    tvl: 0,
    totalContribution: 0,
    contributionLeft: 0,
    getUserInfoDetails: [],
    poolInfo: ""

}

export const Liquidity = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIQUIDITY_INFO:
            return {
                ...state,
                PXAValue: action.pxa,
                tvl: action.tvl,
                totalContribution: action.totalContribution,
                contributionLeft: action.contributionLeft

            }
        case Types.GET_USER_INFO_DETAILS:
            return {
                ...state,
                getUserInfoDetails: action.value
            }
        case Types.GET_POOL_INFO:
            return {
                ...state,
                poolInfo: action.value
            }

        default:
            return state;
    }
}