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

function ActiveGovernance() {
  const dispatch = useDispatch();
  const address = useSelector((store) => store.wallet.walletAddress);
  const activePairs = useSelector((store) => store.pairs.activePairs);
  const currentProvider = useSelector((store) => store.wallet.provider);
  const votes = useSelector((store) => store.pairs.votes);
  const [activeRowExpand, setActiveRowExpands] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loaderState, setScreenLoader] = useState(false);

  useEffect(() => {
    dispatch(Pairs.getActivePairs(address, currentPage));
    setCurrentPage(0);
    dispatch(Pairs.getVotes(address));
    setActiveRowExpands(new Array(activePairs.length).fill(false));
  }, [address]);

  async function upVoteProposal(id, votes) {
    try {
      console.log("challenge governance :votes:", votes);
      if (parseFloat(votes) == 0) {
        Error.toastifyMsg("err", "No Voting Strength");
      } else {
        const web3WalletWrapper = new Web3(currentProvider);
        const Instance = new web3WalletWrapper.eth.Contract(
          contract.GovernanceABI,
          contract.GovernnceAddress
        );

        let _uVote = await Instance.methods
          .castVote(id, true)
          .send({ from: address });
        console.log("_uVote", _uVote);

        if (_uVote) {
          Error.toastifyMsg("info", "Up Vote Success");
        } else {
          Error.toastifyMsg("err", "Up Vote Failed");
        }

        dispatch(Pairs.getActivePairs(address, currentPage));
      }
    } catch (Err) {
      Error.toastifyMsg("err", "Up Vote Failed");
    }

    setScreenLoader(false);
  }

  async function downVoteProposal(id, votes) {
    try {
      console.log("challenge governance :votes:", votes);
      if (parseFloat(votes) == 0) {
        Error.toastifyMsg("err", "No Voting Strength");
      } else {
        const web3WalletWrapper = new Web3(currentProvider);
        const Instance = new web3WalletWrapper.eth.Contract(
          contract.GovernanceABI,
          contract.GovernnceAddress
        );

        let _dVote = await Instance.methods
          .castVote(id, false) //hardcoded proposal ID
          .send({ from: address });
        console.log("_dVote", _dVote);

        if (_dVote) {
          Error.toastifyMsg("info", "Down Vote Success");
        } else {
          Error.toastifyMsg("err", "Down Vote Failed");
        }

        dispatch(Pairs.getActivePairs(address, currentPage));
      }
    } catch (Err) {
      Error.toastifyMsg("err", "Down Vote Failed");
    }

    setScreenLoader(false);
  }

  return activePairs.length !== 0 ? (
    <Card body className="css-card aligncenter margintop30">
      <Card.Header
        style={{ backgroundColor: "#16191e" }}
        className="displayflex"
      >
        <div className="displayflexgraph1 balancecardheader">
          <p>Active Pairs</p>
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

            <td align="left" className="pg__tableHeading">
              Proposal Status
            </td>
            <td align="left" className="pg__tableHeading">
              You Voted
            </td>

            <td align="left" className="pg__tableHeading">
              Your Support
            </td>
            <td align="left" className="pg__tableHeading">
              Start Block
            </td>
            <td align="left" className="pg__tableHeading">
              End Block
            </td>
            <td className="pg__tableHeading"></td>
          </tr>
        </thead>
        <tbody>
          {typeof activePairs === "string" ? (
            <tr>
              <td colSpan={9}>{"No data found"}</td>
            </tr>
          ) : (
            activePairs.map((data, index) => (
              <>
                <tr key={index}>
                  <td className="earn_depositRow">
                    {currentPage * 5 + (index + 1)}
                  </td>
                  <td className="earn_depositRow" align="left">
                    {`Act_` + data.id}
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

                  <td className="earn_depositRow" align="left">
                    {data.startBlock}
                  </td>
                  <td className="earn_depositRow" align="left">
                    {data.endBlock}
                  </td>
                  {/* <td /> */}
                  <td
                    className="earn_depositRow"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const resetExpandPairs = new Array(
                        activePairs.length
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
                  {/* <td /> */}
                </tr>
                {activeRowExpand[index] ? (
                  <tr>
                    <td
                      style={{
                        borderTopWidth: "0px",
                        backgroundColor: "#192028",
                      }}
                      align="left"
                      colSpan={10}
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
                            <b>Pair address</b> : {data.pair}
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
                        {data.hasVoted == false ? (
                          <div style={{ marginTop: "20px" }}>
                            <Button
                              variant="outline-light"
                              size="sm"
                              className="btnvote_pos"
                              loading={loaderState}
                              onClick={() => {
                                setScreenLoader(true);
                                upVoteProposal(data.id, votes.votes);
                              }}
                            >
                              Upvote
                            </Button>
                            <Button
                              variant="outline-light"
                              size="sm"
                              className="btnvote_neg"
                              loading={loaderState}
                              onClick={() => {
                                setScreenLoader(true);
                                downVoteProposal(data.id, votes.votes);
                              }}
                            >
                              Downvote
                            </Button>
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
                            VOTED
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
                  dispatch(Pairs.getActivePairs(address, currentPage - 1));
                }
              }}
            />
            <Pagination.Next
              onClick={() => {
                if (typeof activePairs !== "string") {
                  setCurrentPage(currentPage + 1);
                  dispatch(Pairs.getActivePairs(address, currentPage + 1));
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
      <p className="connectwallettext">No Active Pair(s) found</p>
    </Card>
  );
}

export default ActiveGovernance;
