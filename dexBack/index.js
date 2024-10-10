// const express = require("express");
// const Moralis = require("moralis").default;
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const port = 3001;

// // Middleware để cho phép tất cả các nguồn truy cập (CORS)
// app.use(cors());
// app.use(express.json());

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// // Proxy middleware để chuyển tiếp yêu cầu đến 1inch API
// app.use(
//   "/swap",
//   createProxyMiddleware({
//     target: "https://api.1inch.dev",
//     changeOrigin: true,
//     onProxyReq: (proxyReq) => {
//       // Thêm API key từ biến môi trường
//       proxyReq.setHeader(
//         "Authorization",
//         `Bearer 4OuD4HeWZsEMRZKOJegz4DFUADwGjxz3`
//       );
//     },
//   })
// );

// const apiKey = process.env.REACT_APP_1INCH_KEY; // Đảm bảo rằng bạn đã định nghĩa biến môi trường này

// app.get("/swap/v6.0/1/approve/transaction", async (req, res) => {
//   const { tokenAddress, amount } = req.query;

//   if (!tokenAddress || !amount) {
//     return res.status(400).json({ message: "Missing required query parameters: tokenAddress and amount" });
//   }

//   try {
//     const response = await axios.get(`https://api.1inch.dev/swap/v6.0/1/approve/transaction`, {
//       params: {
//         tokenAddress,
//         amount,
//       },
//       headers: {
//         "Authorization": `Bearer 4OuD4HeWZsEMRZKOJegz4DFUADwGjxz3`, // Sử dụng biến môi trường
//       },
//     });

//     return res.status(200).json(response.data);
//   } catch (error) {
//     console.error("Error fetching approval transaction:", error);
//     return res.status(500).json({ message: "Error fetching approval transaction" });
//   }
// });



// // Route xử lý token price từ Moralis
// app.get("/tokenPrice", async (req, res) => {
//   console.log("Query params:", req.query); // Log params
//   const { query } = req;

//   try {
//     const responseOne = await Moralis.EvmApi.token.getTokenPrice({
//       address: query.addressOne,
//     });

//     const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
//       address: query.addressTwo,
//     });

//     const usdPrices = {
//       tokenOne: responseOne.raw.usdPrice,
//       tokenTwo: responseTwo.raw.usdPrice,
//       ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
//     };

//     return res.status(200).json(usdPrices);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error fetching token prices" });
//   }
// });

// // Khởi động Moralis và backend server
// Moralis.start({
//   apiKey: process.env.MORALIS_KEY,
// }).then(() => {
//   app.listen(port, () => {
//     console.log(`Listening for API Calls on port ${port}`);
//   });
// });


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
    pathRewrite: {
      '^/swap': '', // Rewrites the URL for the target
    },
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
