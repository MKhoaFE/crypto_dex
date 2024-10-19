// dex.sol
// SPDX-License-Identifier: MIT
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

    // Thêm thanh khoản vào DEX
    function addLiquidity(uint amount1, uint amount2) public {
        require(amount1 > 0 && amount2 > 0, "Invalid amounts");
        
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        IERC20(token2).transferFrom(msg.sender, address(this), amount2);

        reserve1 += amount1;
        reserve2 += amount2;
    }

    // Swap với kiểm tra giá từ frontend (Moralis)
    function swap(
        address tokenIn, 
        uint amountIn, 
        address tokenOut, 
        uint expectedPrice  // Giá từ API Moralis
    ) public {
        require(
            (tokenIn == token1 || tokenIn == token2) && 
            (tokenOut == token1 || tokenOut == token2),
            "Invalid token"
        );

        uint amountOut = getAmountOut(amountIn, reserve1, reserve2);
        uint ammPrice = (reserve2 * 1e18) / reserve1;  // Tính giá AMM, scaled by 1e18

        require(
            ammPrice >= expectedPrice - (expectedPrice / 50) &&
            ammPrice <= expectedPrice + (expectedPrice / 50), 
            "Price too far from market"
        );

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        // Cập nhật lượng dự trữ
        if (tokenIn == token1) {
            reserve1 += amountIn;
            reserve2 -= amountOut;
        } else {
            reserve2 += amountIn;
            reserve1 -= amountOut;
        }
    }

    // Tính lượng token trả về khi swap
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint) {
        return (reserveOut * amountIn) / (reserveIn + amountIn);
    }
}
