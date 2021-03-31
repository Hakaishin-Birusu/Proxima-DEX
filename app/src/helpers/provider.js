import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { WalletAction, Error } from "../actions";
import Wallet_Connect from "../models/wallet_model";
import web3 from "web3";

function Provider() {
  const provider = useSelector((store) => store.wallet.provider);
  const { getweb3 } = Wallet_Connect();
  const walletType = useSelector((store) => store.wallet.walletType);
  const dispatch = useDispatch();

  useEffect(() => {
    function changeAccount() {
      if (provider !== "") {
        provider.on("accountsChanged", async (accounts) => {
          dispatch(WalletAction.selectWallet(walletType));
          await getweb3(walletType).then((response) => {
            dispatch(WalletAction.setWalletAddress(accounts[0]));
            response.eth.getBalance(accounts[0]).then(async (result1) => {
              let balance = response.utils.fromWei(result1, "ether");
              dispatch(WalletAction.setWalletEth(balance));
            });
          });
        });

        provider.on("disconnect", (accounts) => {
          //fetchAccountData();c\
          console.log(accounts);
        });
        provider.on("chainChanged", async (chainId) => {
          const _chainId = web3.utils.toBN(chainId).toString();
          if (_chainId == 97 || _chainId == 56) {
          } else {
            Error.toastifyMsg(
              "err",
              "Chainid " + _chainId + " is not supportable"
            );
          }
        });
      }
    }
    changeAccount();
  }, [provider]);
  return <></>;
}
export default Provider;
