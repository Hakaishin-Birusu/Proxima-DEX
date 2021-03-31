import React from "react";
import { Card } from "react-bootstrap";
import "./style.css";
import { useSelector } from "react-redux";
import * as Icon from "react-bootstrap-icons";
import ContributedLiquidity from "../../assets/ct.png";

function Token() {
  const tvl = useSelector((store) => store.liquidity.tvl);
  const totalContribution = useSelector(
    (store) => store.liquidity.totalContribution
  );
  const contributionLeft = useSelector(
    (store) => store.liquidity.contributionLeft
  );

  React.useEffect(() => {
    console.log(contributionLeft);
  });
  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <Card className="mb-2 css-card cardstyle">
            <Card.Body>
              <div className="conLiqCard">
                <Icon.ShieldLock id="attrIcon" />
                <div class="name">
                  <h6>TVL via CL</h6>
                  <span id="currency">$ </span>
                  <span id="presentValue">{tvl}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="mb-2 css-card cardstyle">
            <Card.Body>
              <div className="conLiqCard">
                <Icon.Archive id="attrIcon" />
                <div class="name">
                  <h6>PXA Total Contribution </h6>
                  <span id="currency">PXA </span>
                  <span id="presentValue">{totalContribution}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="mb-2 css-card cardstyle">
            <Card.Body>
              <div className="conLiqCard">
                <Icon.QuestionSquare id="attrIcon" />
                <div class="name">
                  <h6>PXA Contribution Left</h6>
                  <span id="currency">PXA </span>
                  <span id="presentValue">
                    {parseFloat(contributionLeft).toFixed(4)}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div
        className="row liqProvider_ad"
        style={{ margin: "10px 0px 0px 0px" }}
      >
        <div className="col-md-3">
          <img className="ct_happyImage" src={ContributedLiquidity} />
        </div>
        <div id="contentBody" className="col-md-9">
          <div id="contentText" className="ct__fs20">
            Proxima Contributed Liquidity
          </div>
          <div id="contentText" className="ct__fs14">
            Scratch each other's back. Liquidity providers in PXA pairs only has
            to contribute the second token. PXA tokens of equal value are
            provided by foundation (for you to keep). Also earn trading fees
            during locking period.
          </div>
          <a
            style={{
              textDecorationLine: "underline",
              color: "#edf1ff",
              fontSize: "14px",
            }}
            href="https://docs.proxima.finance/guides/contributed-liquidity"
            target="_"
          >
            Read more about contributed liquidity
          </a>
        </div>
      </div>
    </div>
  );
}

export default Token;
