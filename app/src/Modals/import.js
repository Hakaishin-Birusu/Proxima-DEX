import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col, Card, Button } from "react-bootstrap";
import "../index.css";

const style = {
  modal: {
    color: "#fff",
    background: "#2c2f36",
  },
  marginBtm10: {
    marginBottom: "10px",
    color: "#000",
  },
  marginBtm0: {
    marginBottom: "0px",
    marginTop: "10px",
  },
  displayflex: {
    display: "flex",
    justifyContent: "space-between",
  },
  imgheight: {
    height: "40px",
    width: "40px",
    objectFit: "contain",
  },
  marginTop10: {
    marginTop: "10px",
  },
  label: {
    marginBottom: "0px",
    // marginTop: "10px",
    letterSpacing: "1px",
    fontWeight: "600",
    textAlign: "center",
  },
  cardbody: {
    padding: "10px",
    background: "#2c2f36",
    color: "#fff",
    border: "1px solid #2c2f36",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "600",
  },
  showexample: {
    textAlign: "center",
    color: "lightblue",
    fontWeight: "500",
    cursor: "pointer",
  },
  cardbody1: {
    padding: "10px",
    background: "#2c2f36",
    color: "#fff",
    border: "1px solid skyblue",
  },
};

const JSONexample = [
  {
    address: "0x3e757b42BF8A83d15c126e415626884896De6Dd7",
    token: "13.45",
  },
  {
    address: "0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF",
    token: "1.049",
  },
  {
    address: "0x64c9525A3c3a65Ea88b06f184F074C2499578A7E",
    token: "1",
  },
];

function Import(props) {
  const [csv, setCSV] = useState(false);
  const [json, setJSON] = useState(false);
  return (
    <div>
      <Modal
        show={props.open}
        // show={false}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        onHide={props.setOpen}
      >
        <div style={style.modal}>
          <Modal.Header closeButton>
            <Modal.Title
              id="contained-modal-title-vcenter"
              style={style.heading}
            >
              Import Addresses
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <Container>
              <Row>
                <Col xs={6} md={6}>
                  <p
                    style={style.showexample}
                    onClick={() => {
                      setCSV(true);
                      setJSON(false);
                    }}
                  >
                    Show example CSV
                  </p>
                  <Card style={style.marginBtm10}>
                    <Button style={style.cardbody}>
                      {/* <img src={CSV} /> */}

                      <p style={style.label}>Upload CSV file</p>
                    </Button>
                  </Card>
                </Col>

                <Col xs={6} md={6}>
                  <p
                    style={style.showexample}
                    onClick={() => {
                      setCSV(false);
                      setJSON(true);
                    }}
                  >
                    Show example JSON
                  </p>
                  <Card style={style.marginBtm10}>
                    <Button style={style.cardbody}>
                      <p style={style.label}>Upload JSON file</p>
                    </Button>
                  </Card>
                </Col>
              </Row>

              {csv ? (
                <div style={{ marginTop: "10px" }}>
                  <Card body style={style.cardbody1}>
                    <p>0x3e757b42BF8A83d15c126e415626884896De6Dd7,0.000056</p>
                    <p>0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF,13.45</p>
                    <p>0x7D52422D3A5fE9bC92D3aE8167097eE09F1b347d,1.049</p>
                    <p>0x64c9525A3c3a65Ea88b06f184F074C2499578A7E,1</p>
                  </Card>
                </div>
              ) : null}

              {json ? (
                <div style={{ marginTop: "10px" }}>
                  <Card body style={style.cardbody1}>
                    <p>{JSON.stringify(JSONexample)}</p>
                  </Card>
                </div>
              ) : null}
            </Container>
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
}

export default Import;
