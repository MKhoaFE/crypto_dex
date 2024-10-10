import React, { useState } from 'react';
import axios from 'axios';

const Tokens = () => {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [response, setResponse] = useState(null);

  const handleSwap = async () => {
    const url = "/swap/v6.0/1/approve/transaction"; // Call your backend

    const config = {
      params: {
        tokenAddress: fromToken, // Use your token addresses
        amount
      }
    };
    
    try {
      const result = await axios.get(url, config);
      setResponse(result.data);
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Swap Tokens</h1>
      <input 
        type="text" 
        placeholder="From Token Address" 
        value={fromToken} 
        onChange={(e) => setFromToken(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="To Token Address" 
        value={toToken} 
        onChange={(e) => setToToken(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Amount" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
      />
      <button onClick={handleSwap}>Swap</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default Tokens;
