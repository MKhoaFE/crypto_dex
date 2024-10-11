import React, { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";
import axios from "axios";

const Swap = () => {
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [prices, setPrices] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);

  useEffect(() => {
    fetchPrices(tokenOne.address, tokenTwo.address);
  }, []);

  async function fetchPrices(one, two) {
    const res = await axios.get(`http://localhost:3001/tokenPrice`, {
      params: { addressOne: one, addressTwo: two },
    });
    setPrices(res.data);
  }

  function changeAmount(e) {
    const value = e.target.value;
    setTokenOneAmount(value);
    if (value && prices) {
      setTokenTwoAmount((value * prices.ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    const temp = tokenOne;
    setTokenOne(tokenTwo);
    setTokenTwo(temp);
    fetchPrices(tokenTwo.address, tokenOne.address);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i) {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i].address, tokenTwo.address);
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.address, tokenList[i].address);
    }
    setIsOpen(false);
  }

  return (
    <div className="my-6">
      <div className="container d-block">
        <div className="top"></div>
        <div className="bot d-flex">
          <div className="chart-box"></div>
          <div className="swap-box">
            <Modal
              open={isOpen}
              footer={null}
              onCancel={() => setIsOpen(false)}
              title="Select a token"
            >
              <div className="modalContent">
                {tokenList?.map((e, i) => (
                  <div
                    className="tokenChoice"
                    key={i}
                    onClick={() => modifyToken(i)}
                  >
                    <img src={e.img} alt={e.ticker} className="tokenLogo" />
                    <div className="tokenChoiceNames">
                      <div className="tokenName">{e.name}</div>
                      <div className="tokenTicker">{e.ticker}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Modal>
            <div className="tradeBox">
              <div className="tradeBoxHeader">
                <h4>Swap</h4>
              </div>
              <div className="inputs">
                <Input
                  placeholder="0"
                  value={tokenOneAmount}
                  onChange={changeAmount}
                  disabled={!prices}
                />
                <div className="assetOne" onClick={() => openModal(1)}>
                  <img
                    src={tokenOne.img}
                    alt="assetOneLogo"
                    className="assetLogo"
                  />
                  {tokenOne.ticker}
                  <DownOutlined />
                </div>
                <Input
                  placeholder="0"
                  value={tokenTwoAmount}
                  disabled={true}
                />
                <div className="switchButton" onClick={switchTokens}>
                  <ArrowDownOutlined className="switchArrow" />
                </div>
                <div className="assetTwo" onClick={() => openModal(2)}>
                  <img
                    src={tokenTwo.img}
                    alt="assetTwoLogo"
                    className="assetLogo"
                  />
                  {tokenTwo.ticker}
                  <DownOutlined />
                </div>
              </div>
              <div className="swapButton">Swap</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
