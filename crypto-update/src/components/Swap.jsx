import React, { useEffect, useState } from "react";
import { ethers } from "ethers";  // Import ethers.js
import { Input, Modal } from "antd";
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";
import dexAbi from "../abiDEX.json";  // Import ABI

const dexAddress = "0xBFBDe99EFCAE216c8E1e8D8ba6Eb551dEB0a97E8";

const Swap = () => {
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [dexContract, setDexContract] = useState(null);
  const [signer, setSigner] = useState(null);

  // Khởi tạo ethers.js và kết nối với DEX contract
  useEffect(() => {
    const init = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(dexAddress, dexAbi, signer);
      setDexContract(contract);
      setSigner(signer);
    };
    init();
  }, []);

  function changeAmount(e) {
    const value = e.target.value;
    setTokenOneAmount(value);
    if (value && dexContract) {
      const ratio = 1;  // Bạn có thể cập nhật ratio từ Moralis API
      setTokenTwoAmount((value * ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  }

  async function executeSwap() {
    if (!dexContract) return alert("DEX contract not connected");

    try {
      const tx = await dexContract.swap(
        tokenOne.address,
        ethers.utils.parseUnits(tokenOneAmount, 18),  // Chuyển số lượng sang wei
        tokenTwo.address,
        ethers.utils.parseUnits("1", 18)  // Giả định giá mong muốn là 1
      );
      await tx.wait();
      alert("Swap thành công!");
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap thất bại!");
    }
  }

  return (
    <div className="my-6">
      <div className="container d-block">
        <div className="swap-box">
          <Modal
            open={isOpen}
            footer={null}
            onCancel={() => setIsOpen(false)}
            title="Select a token"
          >
            {tokenList.map((e, i) => (
              <div key={i} onClick={() => setTokenOne(tokenList[i])}>
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div>{e.name}</div>
              </div>
            ))}
          </Modal>
          <div className="tradeBox">
            <h4>Swap</h4>
            <div className="inputs">
              <Input placeholder="0" value={tokenOneAmount} onChange={changeAmount} />
              <div className="assetOne" onClick={() => setIsOpen(true)}>
                <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
                {tokenOne.ticker}
                <DownOutlined />
              </div>
              <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
              <div className="switchButton" onClick={() => [setTokenOne(tokenTwo), setTokenTwo(tokenOne)]}>
                <ArrowDownOutlined />
              </div>
              <div className="assetTwo">
                <img src={tokenTwo.img} alt="assetTwoLogo" className="assetLogo" />
                {tokenTwo.ticker}
                <DownOutlined />
              </div>
            </div>
            <button onClick={executeSwap} className="swapButton">Swap</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
