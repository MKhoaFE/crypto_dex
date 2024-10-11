import Swap from "../components/Swap";
import HistoryChart from "../components/HistoryChart";
import CoinDetail from "../components/CoinDetail";

const CryptoDetail = () => {
  return (
    <div className="wrapper-container mt-10">
      <div className="content d-flex gap-4">
        <div className="left" style={{ width: "75%" }}>
          <HistoryChart />
        </div>
        <div className="right" style={{ width: "25%" }}>
          <Swap />
        </div>
      </div>
      <CoinDetail/>
    </div>
  );
};

export default CryptoDetail;
