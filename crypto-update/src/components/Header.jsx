import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import "../components/style/header.css";

const Header = () => {
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Hàm rút gọn địa chỉ ví
  const shortenAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } else {
        setErrorMessage("MetaMask not installed");
      }
    };

    checkWalletConnection();
  }, []);

  const connectWalletHandler = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        setErrorMessage("Connection failed: " + error.message);
      }
    } else {
      setErrorMessage("MetaMask not installed");
    }
  };

  return (
    <div style={{ backgroundColor: "rgb(25, 25, 66)" }}>
      <div className="container content">
        <Link to="/">
          <div className="left d-flex align-items-center">
            <img src="../../inu.png" width={"10%"} alt="" />
            <h1>
              <span style={{ color: "yellow", fontStyle: "italic", fontSize: "2.5rem" }}>I</span>
              <i>nu</i>
              <span style={{ color: "yellow", fontStyle: "italic", fontSize: "2.5rem" }}>S</span>
              <i>wap</i>
            </h1>
          </div>
        </Link>

        <div className="right d-flex gap-1">
          {account ? (
            <p style={{ color: "white", fontSize:"1rem", border:"solid 1px", padding:"0.3rem",borderRadius:"10px" }}>Connected: {shortenAddress(account)}</p>
          ) : (
            <Button variant="outlined" onClick={connectWalletHandler}>
              Connect MetaMask
            </Button>
          )}
        </div>
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Header;
