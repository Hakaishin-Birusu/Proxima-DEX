import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import ActiveGovernance from "./active";
import FinishedGovernance from "./finished";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import PairGovernanceImage from "../../assets/openGovernance.png";
import * as Icon from "react-bootstrap-icons";
import { Pairs } from "../../actions";
import Web3 from "web3";
import { Error } from "../../actions";
import { contract } from "../../common/contractconfig";
import Button from "react-bootstrap-button-loader";

function PairGovernance() {
  const dispatch = useDispatch();
  const currentProvider = useSelector((store) => store.wallet.provider);
  const address = useSelector((store) => store.wallet.walletAddress);
  const votes = useSelector((store) => store.pairs.votes);
  const [loaderState, setScreenLoader] = useState(false);

  useEffect(() => {
    if (address !== "") {
      dispatch(Pairs.getVotes(address));
    }
  }, [address]);

  async function refreshVotes(cVote, mVote) {
    try {
      if (cVote == mVote) {
        Error.toastifyMsg("info", "Already Max Vote Strength ");
      } else {
        console.log("Refresh votes called");

        const web3WalletWrapper = new Web3(currentProvider);
        const Instance = new web3WalletWrapper.eth.Contract(
          contract.PxaABI,
          contract.PxaAddress
        );

        let _pVotes = await Instance.methods
          .delegate(address)
          .send({ from: address });
        console.log("_pVotes", _pVotes);

        if (_pVotes) {
          Error.toastifyMsg("info", "Strength Refresh Success");
          dispatch(Pairs.getVotes(address));
        } else {
          Error.toastifyMsg("err", "Strength Refresh Failed");
        }
      }
    } catch (Err) {
      Error.toastifyMsg("err", "Strength Refresh Failed");
    }
    setScreenLoader(false);
  }

  return (
    <div className="row marginBtm30" style={{ marginTop: "30px" }}>
      <div className="col-md-12">
        <div
          className="row liqProvider_ad"
          style={{ margin: "10px 0px 0px 0px" }}
        >
          <div className="col-md-3">
            <img className="ct_happyImage" src={PairGovernanceImage} />
          </div>
          <div id="contentBody" className="col-md-9">
            <div id="contentText" className="ct__fs20">
              Proxima Pair Governance
            </div>
            <div id="contentText" className="ct__fs14">
              Community decides upon the pairs eligible or ineligible for
              earning PXA rewards. Projects with low community confidence would
              eventually failed to gain majority and would not receive any
              reward.
            </div>
            <a
              style={{
                textDecorationLine: "underline",
                color: "#edf1ff",
                fontSize: "14px",
              }}
              href="https://docs.proxima.finance/guides/pair-governance"
              target="_"
            >
              Read more about pair governance
            </a>
          </div>
        </div>
        {address !== "" ? (
          <div>
            {votes !== "" ? (
              <Card body className="css-card governance_ad">
                <div className="displayflex">
                  <div style={{ display: "flex" }}>
                    <div className="conLiqCard">
                      <Icon.PersonCheckFill id="attrIcon" />
                      <div class="name">
                        <h6>Current Strength</h6>
                        <span id="presentValue">{votes.votes}</span>
                      </div>
                    </div>

                    <div className="conLiqCard" style={{ marginLeft: "5px" }}>
                      <Icon.BagDash id="attrIcon" />
                      <div class="name">
                        <h6>Max Strength</h6>
                        <span id="presentValue">{votes.balance}</span>
                      </div>
                    </div>

                    <div className="conLiqCard" style={{ marginLeft: "15px" }}>
                      <Icon.Alarm id="attrIcon" />
                      <div class="name">
                        <h6>Current Block </h6>
                        <span id="presentValue">{votes.currentBlock}</span>
                      </div>
                    </div>

                    <div className="conLiqCard" style={{ marginLeft: "5px" }}>
                      <Icon.ShieldCheck id="attrIcon" />
                      <div class="name">
                        <h6>Req. Strength to Challenge </h6>
                        <span id="presentValue">{`100000`}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Form inline>
                      {/* <FormControl
                        type="text"
                        placeholder="Address"
                        className="mr-sm-2 serachclass"
                      /> */}
                      <Button
                        variant="outline-success"
                        className="btnvote deligateBtn"
                        loading={loaderState}
                        onClick={() => {
                          setScreenLoader(true);
                          refreshVotes(votes.votes, votes.balance);
                        }}
                      >
                        Refresh Strength
                      </Button>
                    </Form>
                  </div>
                </div>
              </Card>
            ) : null}

            <div>
              <ActiveGovernance />
            </div>

            <div>
              <FinishedGovernance />
            </div>
          </div>
        ) : (
          <Card body className="css-card">
            <p className="connectwallettext">Connect Wallet</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default PairGovernance;
