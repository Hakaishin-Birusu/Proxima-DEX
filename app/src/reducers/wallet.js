import { Types } from "../actions";

const initialState = {
    walletAddress: "",
    walletEth: 0,
    walletType: "",
    PXA: 0,
    provider: ""

}

export const Wallet = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_WALLET:
            return {
                ...state,
                walletAddress: action.address,
            }
        case Types.SET_ETH:
            return {
                ...state,
                walletEth: action.eth
            }
        case Types.SELECT_WALLET_TYPE:
            return {
                ...state,
                walletType: action.wallettype
            }
        case Types.SET_PXA:
            return {
                ...state,
                PXA: action.token
            }
        case Types.SET_PROVIDER:
            return {
                ...state,
                provider: action.provider
            }
        default:
            return state;
    }
}