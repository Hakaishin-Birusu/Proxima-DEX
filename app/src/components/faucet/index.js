import React, { useState, useEffect } from "react";
import { Card, Table, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { SWAP } from "../../actions";
import "../PairGovernance/style.css";
import Web3 from "web3";
import { contract } from "../../common/contractconfig";
import ProximaFaucetEmoji from "../../assets/faucet.png";
import { Error } from "../../actions";
import { convertTimeStamp } from "../../common/functions";
import Button from "react-bootstrap-button-loader";

function Faucet() {
  const dispatch = useDispatch();
  const address = useSelector((store) => store.wallet.walletAddress);
  const faucetRewards = useSelector((store) => store.swap.faucetRewards);
  const currentProvider = useSelector((store) => store.wallet.provider);
  const [selectedOption, setOption] = useState("012");
  const [loaderState, setScreenLoader] = useState(false);

  useEffect(() => {
    console.log("getting faucet rewards", address);
    if (address !== "") {
      dispatch(SWAP.getFaucetRewards(address));
    }
  }, [address]);

  async function claimRewards() {
    try {
      console.log("called claimRewards for option:", selectedOption);
      if (selectedOption == "012") {
        Error.toastifyMsg("err", "Claim Option Not Selected");
      } else {
        const web3WalletWrapper = new Web3(currentProvider);
        const Instance = new web3WalletWrapper.eth.Contract(
          contract.FaucetABI,
          contract.FaucetAddress
        );
        let _result = await Instance.methods
          .getFunds(selectedOption)
          .send({ from: address });
        console.log(_result);
        if (_result) {
          dispatch(SWAP.getFaucetRewards(address));
          Error.toastifyMsg("info", "Claim Success");
        } else {
          Error.toastifyMsg("err", "Claim Failed");
        }
      }
    } catch (err) {
      console.log("err", err);
      Error.toastifyMsg("err", "Claim Failed");
    }
    setScreenLoader(false);
  }

  async function waitClaim() {
    Error.toastifyMsg("err", "Wait For Faucet To Cooldown");
    dispatch(SWAP.getFaucetRewards(address));
    setScreenLoader(false);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div
      className="row marginBtm30"
      style={{ marginTop: "30px", marginBottom: "40px" }}
    >
      <div className="col-md-12">
        {/* <Card body className="css-card aligncenter marginBtm30 governance_ad">
                    <h3 style={{ fontWeight: "600" }}>Proxima Swap Rewards</h3>
                    <p style={{ fontWeight: "600" }} className="marginBtm0">
                        Test Proxima Swap Rewards
                       </p>
                </Card> */}

        <div
          className="row liqProvider_ad"
          style={{ margin: "10px 0px 0px 0px" }}
        >
          <div className="col-md-3">
            <img className="ct_happyImageSwap" src={ProximaFaucetEmoji} />
          </div>
          <div id="contentBody" className="col-md-9">
            <div id="contentText" className="ct__fs20">
              Proxima Faucet
            </div>
            <div id="contentText" className="ct__fs14">
              Claim your fair-share of PXA tokens for active participation in
              the community.
            </div>
            <a
              style={{
                textDecorationLine: "underline",
                color: "#edf1ff",
                fontSize: "14px",
              }}
              href="https://docs.proxima.finance/guides/faucet"
              target="_"
            >
              Read more about Proxima faucet Rewards
            </a>
          </div>
        </div>

        {address !== "" ? (
          <div>
            {faucetRewards !== "" ? (
              <Card body className="css-card governance_ad">
                <div className="row">
                  <div className="col-md-3"></div>
                  <div className="col-md-6">
                    <div
                      className="displayflex"
                      style={{ textAlign: "center" }}
                    >
                      <Table
                        bordered
                        style={{ color: "#fff", marginBottom: "0px" }}
                      >
                        <tbody>
                          <tr>
                            <th>Faucet Balance</th>
                            <td>{faucetRewards.faucetBalance} PXA</td>
                          </tr>
                          <tr>
                            <th>Claim Counter</th>
                            <td>{faucetRewards.counter}</td>
                          </tr>
                          <tr>
                            <th>Current Time</th>
                            <td>
                              {convertTimeStamp(faucetRewards.currentTime)}
                            </td>
                          </tr>
                          <tr>
                            <th>Next Claim Time</th>
                            <td>
                              {convertTimeStamp(faucetRewards.nextClaimTime)}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div className="col-md-3"></div>
                </div>

                <div className="row ">
                  <div className="col-md-3"></div>
                  <div className="col-md-6">
                    <div style={{ marginTop: "20px" }}>
                      <Form.Group>
                        <Form.Control
                          as="select"
                          custom
                          onChange={(e) => setOption(e.target.value)}
                        >
                          <option value="012">--Select Claim--</option>
                          <option value="0">8 hrs - 0.25 PXA</option>
                          <option value="1">24 hrs - 0.75 PXA</option>
                          <option value="2">72 hrs - 2.25 PXA</option>
                        </Form.Control>
                      </Form.Group>
                      {faucetRewards.currentTime >=
                      faucetRewards.nextClaimTime ? (
                        <Button
                          size="sm"
                          className="claimreward"
                          loading={loaderState}
                          onClick={() => {
                            setScreenLoader(true);
                            claimRewards();
                          }}
                        >
                          Claim Rewards
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="claimreward"
                          onClick={() => {
                            waitClaim();
                          }}
                        >
                          Claim Rewards
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3"></div>
                </div>
              </Card>
            ) : (
              <Card
                body
                className="css-card aligncenter margintop30 governance_ad"
              >
                {" "}
                <p className="connectwallettext">No data found</p>
              </Card>
            )}
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

export default Faucet;
