import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import Logo from "../../assets/logo.png";
import "./style.css";
import { Headers } from "../global/constants";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import MultiWallet from "../../Modals/ConnectWallet";

import ErrorModal from "../../Modals/Error";
import WalletDetail from "../../Modals/walletdetail";

import Provider from "../../helpers/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Liquidity } from "../../actions";

function Header() {
  const [walletOpen, setWalletOpen] = useState(false);
  const wallet = useSelector((state) => state.wallet.walletAddress);
  const [selectedWallet, setSelectedWallet] = useState(false);
  const pxaValue = useSelector((state) => state.liquidity.PXAValue);

  const dispatch = useDispatch();

  function setOpen() {
    setWalletOpen(false);
  }

  function setWalletConnectOpen() {
    setSelectedWallet(false);
  }

  function openWalletType() {
    setSelectedWallet(false);
    setWalletOpen(true);
  }
  useEffect(() => {
    dispatch(Liquidity.getLiquidityInfo());
  }, []);

  useEffect(() => {
    if (wallet !== "") {
      setOpen();
    }
  }, [wallet]);

  return (
    <div>
      <ToastContainer style={{ fontWeight: "600", fontSize: "12px" }} />
      <MultiWallet open={walletOpen} setOpen={setOpen} />
      <WalletDetail
        open={selectedWallet}
        setOpen={setWalletConnectOpen}
        openWalletType={openWalletType}
      />
      <Provider />
      <ErrorModal />
      <Navbar expand="lg">
        <Navbar.Brand>
          <a href="https://www.proxima.finance" target="_blank">
            <img src={Logo} style={{ width: "180px" }} />
          </a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto" style={{ marginLeft: "10px" }}>
            {Headers.map((data, index) =>
              data.name == "Bridge" || data.name == "Exchange" ? (
                <a
                  href={data.link}
                  className="headerPtag"
                  target="_blank"
                  key={index}
                >
                  {data.name}
                </a>
              ) : (
                <NavLink
                  to={data.link}
                  exact={true}
                  activeStyle={{ color: "red" }}
                  className="linkhref"
                  key={index}
                >
                  <p className="headerPtag" key={index}>
                    {data.name}
                  </p>
                </NavLink>
              )
            )}
          </Nav>

          <Button
            variant="dark"
            style={{
              backgroundColor: "#16191e",
              color: "#33c221",
              border: "#33c221",
            }}
          >
            PXA: {pxaValue} $
          </Button>
          {wallet !== "" ? (
            <Button
              variant="dark"
              onClick={() => setSelectedWallet(true)}
              className="connectwallet"
            >
              {wallet &&
                wallet.substr(0, 6) + "..." + wallet.substr(wallet.length - 4)}
            </Button>
          ) : (
            <Button
              variant="dark"
              className="connectwallet"
              onClick={() => setWalletOpen(true)}
            >
              Connect wallet
            </Button>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
