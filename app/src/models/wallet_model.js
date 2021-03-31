
import React, { useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
// import Authereum from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDispatch } from "react-redux";
import { WalletAction } from "../actions"


export default function Wallet_model() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    return {
        get web3Loading() {
            return loading
        },
        async getweb3(wallettype) {
            setLoading(true);
            let web3Modal;
            let provider;
            let web3;
            let providerOptions;
            providerOptions = {
                metamask: {
                    id: "injected",
                    name: "MetaMask",
                    type: "injected",
                    check: "isMetaMask"
                },
                walletconnect: {
                    package: WalletConnectProvider, // required
                    options: {
                        infuraId: "915c9126b0ac45aebe016f249c167bab", // Required
                        network: "kovan",
                        qrcodeModalOptions: {
                            mobileLinks: [
                                "rainbow",
                                "metamask",
                                "argent",
                                "trust",
                                "imtoken",
                                "pillar"
                            ]
                        }
                    }
                },
            };
            web3Modal = new Web3Modal({
                network: "rinkeby",
                cacheProvider: true,
                providerOptions
            });
            // provider = await web3Modal.connectTo("injected");
            provider = await web3Modal.connectTo(wallettype);
            dispatch(WalletAction.setProvider(provider))
            provider.on("error", e => console.error("WS Error", e));
            provider.on("end", e => console.error("WS End", e));

            provider.on("disconnect", (data, err) => {
                console.log(err);
            });
            provider.on("connect", (info) => {
                console.log(info);
            });

            web3 = new Web3(provider);
            setLoading(false);
            return web3;
        },
    }
}