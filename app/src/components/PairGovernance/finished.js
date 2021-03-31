import React, { useState, useEffect } from "react";
import { Card, Table, Pagination } from "react-bootstrap";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import { Pairs } from "../../actions";
import * as Icon from "react-bootstrap-icons";
import Web3 from "web3";
import { contract } from "../../common/contractconfig";
import { Error } from "../../actions";
import Button from "react-bootstrap-button-loader";

function FinishedGovernance() {
  const dispatch = useDispatch();
  const currentProvider = useSelector((store) => store.wallet.provider);
  const address = useSelector((store) => store.wallet.walletAddress);
  const finishedPairs = useSelector((store) => store.pairs.finishedPairs);
  const votes = useSelector((store) => store.pairs.votes);
  const [activeRowExpand, setActiveRowExpands] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loaderState, setScreenLoader] = useState(false);

  useEffect(() => {
    dispatch(Pairs.getFinishedPairs(address, currentPage));
    setCurrentPage(0);
    dispatch(Pairs.getVotes(address));
    setActiveRowExpands(new Array(finishedPairs.length).fill(false));
  }, [address]);

  async function governanceChallenge(id, votes) {
    try {
      console.log("challenge governance :votes:", votes);
      if (parseFloat(votes) < 100000) {
        Error.toastifyMsg("err", "Insufficient Voting Strength");
      } else {
        const web3WalletWrapper = new Web3(currentProvider);
        const Instance = new web3WalletWrapper.eth.Contract(
          contract.GovernanceABI,
          contract.GovernnceAddress
        );

        let _cGovernance = await Instance.methods
          .challengeGovernance(id)
          .send({ from: address });
        console.log("_cGovernance", _cGovernance);

        if (_cGovernance) {
          Error.toastifyMsg("info", "Challenge Success");
        } else {
          Error.toastifyMsg("err", "Challenge Failed");
        }

        dispatch(Pairs.getActivePairs(address, 0));
        dispatch(Pairs.getFinishedPairs(address, currentPage));
      }
    } catch (Err) {
      Error.toastifyMsg("err", "Challenge Failed");
    }

    setScreenLoader(false);
  }

  async function ExecuteGovernance(id) {
    try {
      console.log("Execute Governance called for id", id);

      const web3WalletWrapper = new Web3(currentProvider);
      const Instance = new web3WalletWrapper.eth.Contract(
        contract.GovernanceABI,
        contract.GovernnceAddress
      );

      let _eGovernance = await Instance.methods
        .execute(id)
        .send({ from: address });
      console.log("_eGovernance", _eGovernance);

      if (_eGovernance) {
        Error.toastifyMsg("info", "Execution Success");
      } else {
        Error.toastifyMsg("err", "Execution Failed");
      }

      dispatch(Pairs.getFinishedPairs(address, currentPage));
    } catch (Err) {
      Error.toastifyMsg("err", "Execution Failed");
    }

    setScreenLoader(false);
  }

  return finishedPairs.length !== 0 ? (
    <Card body className="css-card aligncenter margintop30">
      <Card.Header
        style={{ backgroundColor: "#16191e" }}
        className="displayflex"
      >
        <div className="displayflexgraph1 balancecardheader">
          <p>Finished Pairs</p>
        </div>
      </Card.Header>
      <Table
        responsive
        hover
        variant="dark"
        id="active-governance-table"
        style={{ marginBottom: "0px" }}
      >
        <thead>
          <tr>
            <td className="pg__tableHeading">#</td>
            <td align="left" className="pg__tableHeading">
              Proposal ID
            </td>
            <td align="left" className="pg__tableHeading">
              Proposal Name
            </td>
            {/* <td align="left" className="pg__tableHeading">
                  Pair Name
                </td> */}
            <td align="left" className="pg__tableHeading">
              Proposal Status
            </td>
            {/* <td align="left" className="pg__tableHeading">Start</td> */}
            <td align="left" className="pg__tableHeading">
              You Voted
            </td>

            <td align="left" className="pg__tableHeading">
              Your Support
            </td>

            <td align="left" className="pg__tableHeading">
              End Block
            </td>
            <td className="pg__tableHeading"></td>
          </tr>
        </thead>
        <tbody>
          {typeof finishedPairs === "string" ? (
            <tr>
              <td colSpan={8}>{"No data found"}</td>
            </tr>
          ) : (
            finishedPairs.map((data, index) => (
              <>
                <tr key={index}>
                  <td className="earn_depositRow">
                    {currentPage * 5 + (index + 1)}
                  </td>

                  <td className="earn_depositRow" align="left">
                    {`Fin_` + data.id}
                  </td>
                  <td className="earn_depositRow" align="left">
                    {data.pairName}
                  </td>

                  <td
                    className="earn_depositRow"
                    align="left"
                    style={{
                      color: "#edf1ff",
                    }}
                  >
                    {data.pairStatus}
                  </td>

                  {data.hasVoted == false ? (
                    <td className="earn_depositRow" align="left">
                      <div style={{ color: "#ca5425" }}>{`NO`}</div>
                    </td>
                  ) : (
                    <td className="earn_depositRow" align="left">
                      <div style={{ color: "#00FF00" }}>{`YES`}</div>
                    </td>
                  )}

                  {data.support == false ? (
                    <td className="earn_depositRow" align="left">
                      <div style={{ color: "#ca5425" }}>{data.votes}</div>
                    </td>
                  ) : (
                    <td className="earn_depositRow" align="left">
                      <div style={{ color: "#00FF00" }}>{data.votes}</div>
                    </td>
                  )}

                  {/* <td className="earn_depositRow" align="left">
                    <p className="pair_address earn_depositRow">
                      <span className="elips">{data.pair}</span>
                    </p>
                  </td> */}
                  {/* {data.pxa !== "" ? (
                    <td align="left">{data.pxa}</td>
                  ) : (
                    <td>
                      <div id="greyout"></div>
                    </td>
                  )} */}
                  {/* <td className="earn_depositRow" align="left">
                    <ProgressBar>
                      <ProgressBar variant="success" now={30} key={1} />
                    </ProgressBar>
                  </td> */}
                  <td className="earn_depositRow" align="left">
                    {data.endBlock}
                  </td>
                  <td
                    className="earn_depositRow"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const resetExpandPairs = new Array(
                        finishedPairs.length
                      ).fill(false);
                      resetExpandPairs[index] = !activeRowExpand[index];
                      setActiveRowExpands(resetExpandPairs);
                    }}
                  >
                    {activeRowExpand[index] ? (
                      <Icon.CaretDownFill
                        id="attrIcon"
                        fill="#95999c"
                        style={{ width: "16px", height: "16px" }}
                      />
                    ) : (
                      <Icon.CaretRightFill
                        id="attrIcon"
                        fill="#95999c"
                        style={{ width: "16px", height: "16px" }}
                      />
                    )}
                  </td>
                </tr>
                {activeRowExpand[index] ? (
                  <tr>
                    <td
                      style={{
                        borderTopWidth: "0px",
                        backgroundColor: "#192028",
                      }}
                      align="left"
                      colSpan={8}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          color: "#a0aec0",
                        }}
                      >
                        <div>
                          <b>Proposer</b> : {data.proposer}
                        </div>
                        <div
                          id="addressWithVotes"
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <div>
                            <b>Pair</b> : {data.pair}
                          </div>
                          <div style={{ position: "absolute", right: "70px" }}>
                            <div style={{ display: "flex" }}>
                              <div
                                className="conLiqCard"
                                style={{ marginLeft: "20px" }}
                              >
                                <Icon.HandThumbsUpFill
                                  id="attrIcon"
                                  fill="#59a43b"
                                  style={{ width: "30px", height: "30px" }}
                                />
                                <div class="name">
                                  <div style={{ fontSize: "14px" }}>
                                    Up votes
                                  </div>
                                  <span id="presentValue">{data.forVotes}</span>
                                </div>
                              </div>

                              <div
                                className="conLiqCard"
                                style={{ marginLeft: "20px" }}
                              >
                                <Icon.HandThumbsDownFill
                                  id="attrIcon"
                                  fill="#ca5425"
                                  style={{ width: "30px", height: "30px" }}
                                />
                                <div class="name">
                                  <div style={{ fontSize: "14px" }}>
                                    Down votes
                                  </div>
                                  <span
                                    id="presentValue"
                                    style={{ color: "#ca5425" }}
                                  >
                                    {data.againstVotes}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <b>Token0</b> : {data.token0}
                        </div>
                        <div>
                          <b> Token1</b> : {data.token1}
                        </div>

                        {data.pairStatus != "Challenged" ? (
                          <div style={{ marginTop: "20px" }}>
                            {data.pairStatus != "Executed" ? (
                              <div style={{ marginTop: "20px" }}>
                                <Button
                                  variant="outline-light"
                                  size="sm"
                                  className="btnvote_pos"
                                  loading={loaderState}
                                  onClick={() => {
                                    setScreenLoader(true);
                                    ExecuteGovernance(data.id);
                                  }}
                                >
                                  Execute
                                </Button>
                                <Button
                                  variant="outline-light"
                                  size="sm"
                                  className="btnvote_neg"
                                  loading={loaderState}
                                  onClick={() => {
                                    setScreenLoader(true);
                                    governanceChallenge(data.id, votes.votes);
                                  }}
                                >
                                  Challenge
                                </Button>
                              </div>
                            ) : (
                              <div style={{ marginTop: "20px" }}>
                                <Button
                                  variant="dark"
                                  style={{
                                    backgroundColor: "#16191e",
                                    color: "#33c221",
                                    border: "#33c221",
                                    marginRight: "15px",
                                  }}
                                  disabled="true"
                                >
                                  Executed
                                </Button>
                                <Button
                                  variant="outline-light"
                                  size="sm"
                                  className="btnvote_neg"
                                  loading={loaderState}
                                  onClick={() => {
                                    setScreenLoader(true);
                                    governanceChallenge(data.id, votes.votes);
                                  }}
                                >
                                  Challenge
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant="dark"
                            style={{
                              backgroundColor: "#16191e",
                              color: "#33c221",
                              border: "#33c221",
                              marginTop: "20px",
                            }}
                            disabled="true"
                          >
                            Already Challenged
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
              </>
            ))
          )}
        </tbody>
      </Table>

      <div className="paginationcss">
        <div className="paginationcsstext">Item per page : 5</div>
        {/* <div className="paginationcsstext">1 – 5 of 30</div> */}
        <div>
          <Pagination className="paginationbtn">
            <Pagination.Prev
              onClick={() => {
                if (currentPage - 1 != -1) {
                  setCurrentPage(currentPage - 1);
                  dispatch(Pairs.getFinishedPairs(address, currentPage - 1));
                }
              }}
            />
            <Pagination.Next
              onClick={() => {
                if (typeof finishedPairs !== "string") {
                  setCurrentPage(currentPage + 1);
                  dispatch(Pairs.getFinishedPairs(address, currentPage + 1));
                }
              }}
            />
          </Pagination>
        </div>
      </div>
    </Card>
  ) : (
    <Card body className="css-card aligncenter margintop30 governance_ad">
      {" "}
      <p className="connectwallettext">No Finished Pair(s) found</p>
    </Card>
  );
}

export default FinishedGovernance;
