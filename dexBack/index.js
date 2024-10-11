

const express = require("express");
const Moralis = require("moralis").default;
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require("cors");
require("dotenv").config();
const axios = require('axios');

const app = express();
const port = 3001;

// Middleware để cho phép tất cả các nguồn truy cập (CORS)
app.use(cors());
app.use(express.json());

// Proxy middleware để chuyển tiếp yêu cầu đến 1inch API
app.use(
  "/swap",
  createProxyMiddleware({
    target: "https://api.1inch.dev",
    changeOrigin: true,
    pathRewrite: { '^/swap': '/swap' },

    onProxyReq: (proxyReq) => {
      proxyReq.setHeader(
        "Authorization",
        `Bearer ${process.env.REACT_APP_1INCH_KEY}`
      );
    },
  })
);


// Route xử lý token price từ Moralis
app.get("/tokenPrice", async (req, res) => {
  const { query } = req;

  try {
    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressOne,
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressTwo,
    });

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };

    return res.status(200).json(usdPrices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching token prices" });
  }
});



// Khởi động Moralis và backend server
Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on port ${port}`);
  });
});
