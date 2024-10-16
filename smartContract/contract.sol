pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyDEX {
    address public token1;
    address public token2;
    uint public reserve1;
    uint public reserve2;

    constructor(address _token1, address _token2) {
        token1 = _token1;
        token2 = _token2;
    }

    function addLiquidity(uint amount1, uint amount2) public {
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        IERC20(token2).transferFrom(msg.sender, address(this), amount2);
        // Logic to update reserves and mint LP tokens
    }

    function swap(address tokenIn, uint amountIn, address tokenOut, uint amountOutMin) public {
        // Logic to handle swaps and charge fees
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint) {
        uint product = reserveIn * reserveOut;
        return product / (reserveIn + amountIn);  // AMM formula
    }
}