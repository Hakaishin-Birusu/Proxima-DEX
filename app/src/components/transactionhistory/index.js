import React from "react";
import {} from "react-bootstrap";
import "./style.css";

const test = [
  // { val: "BNB 5.002 to Ether 3.333" },
  // { val: "BNB 5.002 to Ether 3.333" },
  // { val: "BNB 5.002 to Ether 3.333" },
  // { val: "BNB 5.002 to Ether 3.333" },
  // { val: "BNB 5.002 to Ether 3.333" },
];

function TransactionHistory() {
  return (
    <div style={{ marginTop: "20px" }}>
      {test.map((data, index) => (
        <a href="" target="_blank">
          <p className="ptag" key={index}>
            {data.val}
          </p>
        </a>
      ))}
    </div>
  );
}

export default TransactionHistory;
