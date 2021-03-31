import { Types } from "./types";

export const WalletAction = {
    setWalletAddress,
    setWalletEth,
    selectWallet,
    setPXA,
    setProvider
}
function setWalletAddress(address) {
    return dispatch => {
        dispatch(setwallet(address))
    }
}
function setWalletEth(eth) {
    return dispatch => {
        dispatch(setEth(eth))
    }
}

function selectWallet(wallet) {
    return dispatch => {
        dispatch(selectWalletType(wallet))
    }
}


function setPXA(token) {
    return dispatch => {
        dispatch(setPXAValue(token))
    }
}

function setProvider(provider) {
    return dispatch => {
        dispatch(setWalletProvider(provider))
    }
}

function setwallet(address) { return { type: Types.GET_WALLET, address: address } };
function setEth(eth) { return { type: Types.SET_ETH, eth: eth } };
function selectWalletType(wallettype) { return { type: Types.SELECT_WALLET_TYPE, wallettype: wallettype } }
function setPXAValue(token) { return { type: Types.SET_PXA, token: token } }
function setWalletProvider(provider) { return { type: Types.SET_PROVIDER, provider: provider } }