import React, { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";

const Swap = () => {
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(null); // Initially null to show "Select Token"
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
  }

  function switchTokens() {
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i) {
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
    } else {
      setTokenTwo(tokenList[i]);
    }
    setIsOpen(false);
  }
  return (
    <div className="my-6">
      <>
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
                  {tokenList?.map((e, i) => {
                    return (
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
                    );
                  })}
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
                  />
                  <div className="assetOne" onClick={() => openModal(1)}>
                    {tokenOne ? (
                      <>
                        <img
                          src={tokenOne.img}
                          alt="assetOneLogo"
                          className="assetLogo"
                        />
                        {tokenOne.ticker}
                      </>
                    ) : (
                      "Select Token"
                    )}
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
      </>
    </div>
  );
};

export default Swap;
