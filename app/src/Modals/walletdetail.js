import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col, Card, Button } from "react-bootstrap";
import "../index.css";
import "./walletdetails.css";
import { useSelector } from "react-redux";
import { Constants } from "../common/constants";

import TransactionHistory from "../components/transactionhistory";

function WalletDetail(props) {

    const wallet = useSelector(store => store.wallet.walletAddress);
    const walletType = useSelector(store => store.wallet.walletType);
    const [copyText, setCopyText] = useState("Copy Address");



    function copyClipBoard(which) {
        const el = document.createElement('textarea');
        el.value = which;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        setCopyText("Copied!!!");
        setTimeout(() => {
            setCopyText("Copy Address");
        }, 1000)
    }

    return (
        <div>
            <Modal show={props.open} centered aria-labelledby="contained-modal-title-vcenter"
                onHide={props.setOpen}
                dialogClassName="modalbackground"
            >
                <div style={{ borderRadius: "10px" }}>
                    <div className="modalwallet" >
                        <Modal.Header
                            closeButton
                            className="modalheader"
                        >
                            <Modal.Title id="contained-modal-title-vcenter" className="heading" >
                                Account
                     </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="show-grid" >
                            <Container >
                                <Col xs={12} md={12} className="colfont">
                                    <div className="displayflex" >
                                        <p className="marginBtm0" >Connected with {walletType == "injected" ? "Metamask" : walletType} </p>
                                        <Button variant="dark" size="sm" className="changebtn" onClick={props.openWalletType}>Change </Button>
                                    </div>
                                    <div>
                                        <p className="addressstyle">
                                            {wallet && (wallet.substr(0, 6) + "..." + wallet.substr(wallet.length - 4))}
                                        </p>
                                    </div>

                                    <div className="flexdisplay">
                                        <p className="copyaddress" onClick={() => copyClipBoard(wallet)}>
                                            <span> <i className="fa fa-clone" aria-hidden="true"></i></span><span> {copyText}</span>
                                        </p>&nbsp;&nbsp;
                                        <p className="copyaddress" >
                                            <a href={Constants.etherScan + wallet} target="_blank" className="ahreffont">   <span> <i className="fa fa-external-link" aria-hidden="true"></i></span><span> View on EtherScan</span></a>

                                        </p>
                                    </div>
                                </Col>

                                <TransactionHistory />
                            </Container>
                        </Modal.Body>
                    </div>
                </div>
            </Modal>

        </div >
    )
}

export default WalletDetail;