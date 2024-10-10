const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require("dotenv").config();
const app = express();

app.use(cors());

module.exports = function (app) {

  app.use( "/swap",
    createProxyMiddleware({
      target: "https://api.1inch.dev",
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        // add API key in Header
        proxyReq.setHeader(
          "Authorization",
          `Bearer ${process.env.REACT_APP_1INCH_KEY}`
          );
        },
      })
     );
    };

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Proxy server đang chạy trên cổng ${PORT}`);
});