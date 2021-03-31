import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col, Card, Button } from "react-bootstrap";
import "../index.css";
import { SUPPORTED_WALLETS } from "../common/pages";
import Wallet_Connect from "../models/wallet_model";

import { useDispatch, useSelector } from "react-redux";
import { WalletAction, Error } from "../actions";
// import { StakingInstance } from "../helpers/contractinstance";


import {
    BscConnector,
    UserRejectedRequestError,
} from '@binance-chain/bsc-connector'
import {
    ConnectionRejectedError,
    useWallet,
    UseWalletProvider,
} from 'use-wallet'

const style = {
    modal: {
        color: "#fff",
        background: "#2c2f36"
    },
    marginBtm10: {
        marginBottom: "10px",
        color: "#000"
    },
    marginBtm0: {
        marginBottom: "0px",
        marginTop: "10px"
    },
    displayflex: {
        display: "flex",
        justifyContent: "space-between"
    },
    imgheight: {
        height: "40px",
        width: "40px",
        objectFit: "contain"
    },
    marginTop10: {
        marginTop: "10px"
    },
    label: {
        marginBottom: "0px",
        marginTop: "10px",
        letterSpacing: "1px",
        fontWeight: "600"
    },
    cardbody: {
        padding: "10px",
        background: "#2c2f36",
        color: "#fff",
        border: "1px solid #2c2f36"
    },
    heading: {
        fontSize: "16px",
        fontWeight: "600",
    },
    flexdirection: {
        display: "flex"
    },
    dot: {
        color: "#35ed35",
        marginTop: "12px"
    }
}

function Modals(props) {

    const { getweb3 } = Wallet_Connect();
    const walletType = useSelector(store => store.wallet.walletType);
    const dispatch = useDispatch();
    const { account, connect, reset, ethereum, status } = useWallet()

    async function selectWallet(type) {
        dispatch(WalletAction.selectWallet(type))
        await getweb3(type).then(async (response) => {
            const _chainId = await response.eth.getChainId();
            if (_chainId == 56 || _chainId == 97) {
                response.eth.getAccounts().then((result) => {
                    dispatch(WalletAction.setWalletAddress(result[0]))
                    response.eth.getBalance(result[0]).then(async (result1) => {
                        let balance = response.utils.fromWei(result1, 'ether');
                        dispatch(WalletAction.setWalletEth(balance))
                    })
                });
            }
            else {
                Error.toastifyMsg('err', "Chainid " + _chainId + " is not supportable");
            }
        });
    }
    useEffect(() => {
        getBinanceWalletDetails();
    }, [status])


    function getBinanceWalletDetails() {
        if (status == "connected") {
            dispatch(WalletAction.selectWallet('binance'));
            dispatch(WalletAction.setWalletAddress(account));
            dispatch(WalletAction.setProvider(ethereum));
        }
    }


    async function setBinanceWallet() {
        try {
            await connect('bsc');
        }
        catch (err) {
            Error.toastifyMsg('err', err.message);
        }
    }

    return (
        <div>
            <Modal show={props.open} centered aria-labelledby="contained-modal-title-vcenter" onHide={props.setOpen} dialogClassName="modalbackground">
                <div style={style.modal}>
                    <Modal.Header closeButton >
                        <Modal.Title id="contained-modal-title-vcenter" style={style.heading}>
                            Connect to a wallet
                     </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid" >
                        <Container>
                            <Row>
                                <Col xs={12} md={12}>
                                    {Object.values(SUPPORTED_WALLETS).map((data, index) => (
                                        <Card style={style.marginBtm10} key={index} onClick={data.connector == "binance" ? () => setBinanceWallet(data.connector) : () => selectWallet(data.connector)}>
                                            <Button style={style.cardbody}>
                                                <div style={style.displayflex}>
                                                    <div style={style.flexdirection}>
                                                        {data.connector == walletType ? <i className="fa fa-circle" aria-hidden="true" style={style.dot}></i> : null}&nbsp;&nbsp; <p style={style.label}>{data.name}</p>
                                                    </div>
                                                    <img src={data.iconName} alt="preview" style={style.imgheight} />
                                                </div>
                                            </Button>
                                        </Card>
                                    ))}
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </div>
            </Modal>

        </div>
    )
}


export default (props) => (
    <UseWalletProvider
        connectors={{
            bsc: {
                web3ReactConnector() {
                    return new BscConnector({ supportedChainIds: [56, 97] })
                },
                handleActivationError(err) {
                    Error.toastifyMsg("err", err.message);
                    // if (err instanceof UserRejectedRequestError) {
                    //     return new ConnectionRejectedError()
                    // }
                },
            },
        }}
    >
        <Modals {...props} />
    </UseWalletProvider>
)

//export default Modals;