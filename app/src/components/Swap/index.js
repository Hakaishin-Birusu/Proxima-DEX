import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { SWAP } from "../../actions";
import "../PairGovernance/style.css";
import Web3 from "web3";
import { contract } from "../../common/contractconfig";
import ProximaSwapEmoji from "../../assets/swapRewards.png";
import Faucet from "../faucet";
import { Error } from "../../actions";
import Button from "react-bootstrap-button-loader";

function Swap() {
  const dispatch = useDispatch();
  const address = useSelector((store) => store.wallet.walletAddress);
  const swapRewards = useSelector((store) => store.swap.swapRewards);
  const currentProvider = useSelector((store) => store.wallet.provider);
  const [loaderState, setScreenLoader] = useState(false);

  useEffect(() => {
    console.log("getting swap rewards", address);
    if (address !== "") {
      dispatch(SWAP.getSwapRewards(address));
    }
  }, [address]);

  async function claimRewards() {
    try {
      const web3WalletWrapper = new Web3(currentProvider);
      const Instance = new web3WalletWrapper.eth.Contract(
        contract.SwapABI,
        contract.SwapRewardsAddress
      );
      let _claimingBal = await Instance.methods
        .getUserPendingShares(address)
        .call();
      console.log("claimAmount", _claimingBal);
      if (_claimingBal > 0) {
        let _result = await Instance.methods
          .releaseUserShare()
          .send({ from: address });
        console.log(_result);
        if (_result) {
          dispatch(SWAP.getSwapRewards(address));
          Error.toastifyMsg("info", "Claim Success");
        } else {
          Error.toastifyMsg("err", "Claim Failed");
        }
      } else {
        Error.toastifyMsg("err", "No Claiming Balance");

        dispatch(SWAP.getSwapRewards(address));
      }
    } catch (err) {
      Error.toastifyMsg("err", "Claim Failed");
    }
    setScreenLoader(false);
  }

  return (
    <div className="row marginBtm30" style={{ marginTop: "30px" }}>
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
            <img className="ct_happyImageSwap" src={ProximaSwapEmoji} />
          </div>
          <div id="contentBody" className="col-md-9">
            <div id="contentText" className="ct__fs20">
              Proxima Swap Rewards
            </div>
            <div id="contentText" className="ct__fs14">
              Claim your reward earned from Swapping on Proxima Swap.
            </div>
            <a
              style={{
                textDecorationLine: "underline",
                color: "#edf1ff",
                fontSize: "14px",
              }}
              href="https://docs.proxima.finance/guides/user-rewards"
              target="_"
            >
              Read more about Proxima Swap Rewards
            </a>
          </div>
        </div>

        {address !== "" ? (
          <div>
            {swapRewards !== "" ? (
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
                            <th>Current Balance</th>
                            <td>{swapRewards.balance + ` PXA`}</td>
                          </tr>
                          <tr>
                            <th>Claimable Balance</th>
                            <td>{swapRewards.claimableBalance + ` PXA`}</td>
                          </tr>
                          {/* <tr>
                            <th>Total Balance</th>
                            <td>{swapRewards.totalBalance}</td>
                          </tr> */}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div className="col-md-3"></div>
                </div>

                <div className="row ">
                  <div className="col-md-3"></div>
                  <div className="col-md-6">
                    <div style={{ marginTop: "30px" }}>
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

        <Faucet />
      </div>
    </div>
  );
}

export default Swap;
