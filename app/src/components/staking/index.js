import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import "./style.css";
import Token from "../tokens";
import Ether from "./ether";
import BUSD from "./busd";
import BNB from "./bnb";
import BTC from "./wbtc";
import Dot from "./dot";

function Staking() {
  const [activeKey, setActiveKey] = useState(1);

  function handleSelect(key) {
    setActiveKey(key);
  }

  return (
    <div className="margintop50 marginbottom50">
      <Token />

      <div style={{ marginTop: "30px" }}>
        <Nav
          fill="red"
          variant="tabs"
          justify
          activeKey={activeKey}
          onSelect={handleSelect}
        >
          <Nav.Item>
            <Nav.Link eventKey={1}>BNB</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={2}>ETHER</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={3}>BUSD</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={4}>BTC</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey={5}>DOT</Nav.Link>
          </Nav.Item>
        </Nav>

        <div style={{ marginTop: "30px" }}>
          {activeKey == 1 ? <BNB /> : null}
          {activeKey == 2 ? <Ether /> : null}
          {activeKey == 3 ? <BUSD /> : null}
          {activeKey == 4 ? <BTC /> : null}
          {activeKey == 5 ? <Dot /> : null}
        </div>
      </div>
    </div>
  );
}

export default Staking;
