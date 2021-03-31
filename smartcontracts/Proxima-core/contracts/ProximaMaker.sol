// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./interfaces/IUniswapV2ERC20.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Factory.sol";

/**
 * @title : ProximaMaker
 * @notice : Copied and Modified from SUSHI
 * https://github.com/sushiswap/sushiswap/blob/master/contracts/SushiMaker.sol
 * Developed by ProximusAlpha
 */

contract ProximaMaker is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    /// @dev Factory Address
    IUniswapV2Factory public immutable factory;
    /// @dev Storage Address
    address public immutable BBStorage;
    /// @dev Proxima Token Address
    address private immutable pxa;
    /// @dev wBNB Token Address
    address private immutable bnb;

    /// @dev Bridge map
    mapping(address => address) internal _bridges;

    /// @dev Event emitted when bridge is set
    event LogBridgeSet(address indexed token, address indexed bridge);
    /// @dev Event emitted when tokens are converted
    event LogConvert(
        address indexed server,
        address indexed token0,
        address indexed token1,
        uint256 amount0,
        uint256 amount1,
        uint256 amountPXA
    );

    /// @dev Sets mandate
    constructor(
        address _factory,
        address _BBStorage,
        address _pxa,
        address _bnb
    ) public {
        factory = IUniswapV2Factory(_factory);
        BBStorage = _BBStorage;
        pxa = _pxa;
        bnb = _bnb;
    }

    /// @dev Returns Bridge
    function bridgeFor(address token) public view returns (address bridge) {
        bridge = _bridges[token];
        if (bridge == address(0)) {
            bridge = bnb;
        }
    }

    /// @dev Sets Bridge
    function setBridge(address token, address bridge) external onlyOwner {
        require(
            token != pxa && token != bnb && token != bridge,
            "ProximaMaker: Invalid bridge"
        );

        _bridges[token] = bridge;
        emit LogBridgeSet(token, bridge);
    }

    /// @dev Auth EOA modifier
    modifier onlyEOA() {
        require(msg.sender == tx.origin, "ProximaMaker: must use EOA");
        _;
    }

    /// @dev Converts tokens
    function convert(address token0, address token1) external onlyEOA() {
        _convert(token0, token1);
    }

    /// @dev Converts multiple tokens
    function convertMultiple(
        address[] calldata token0,
        address[] calldata token1
    ) external onlyEOA() {
        uint256 len = token0.length;
        for (uint256 i = 0; i < len; i++) {
            _convert(token0[i], token1[i]);
        }
    }

    function _convert(address token0, address token1) internal {
        IUniswapV2Pair pair = IUniswapV2Pair(factory.getPair(token0, token1));
        require(address(pair) != address(0), "ProximaMaker: Invalid pair");
        IERC20(address(pair)).safeTransfer(
            address(pair),
            pair.balanceOf(address(this))
        );
        (uint256 amount0, uint256 amount1) = pair.burn(address(this));
        if (token0 != pair.token0()) {
            (amount0, amount1) = (amount1, amount0);
        }
        emit LogConvert(
            msg.sender,
            token0,
            token1,
            amount0,
            amount1,
            _convertStep(token0, token1, amount0, amount1)
        );
    }

    function _convertStep(
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1
    ) internal returns (uint256 pxaOut) {
        if (token0 == token1) {
            uint256 amount = amount0.add(amount1);
            if (token0 == pxa) {
                IERC20(pxa).safeTransfer(BBStorage, amount);
                pxaOut = amount;
            } else if (token0 == bnb) {
                pxaOut = _toPXA(bnb, amount);
            } else {
                address bridge = bridgeFor(token0);
                amount = _swap(token0, bridge, amount, address(this));
                pxaOut = _convertStep(bridge, bridge, amount, 0);
            }
        } else if (token0 == pxa) {
            // eg. PXA - ETH
            IERC20(pxa).safeTransfer(BBStorage, amount0);
            pxaOut = _toPXA(token1, amount1).add(amount0);
        } else if (token1 == pxa) {
            // eg. USDT - PXA
            IERC20(pxa).safeTransfer(BBStorage, amount1);
            pxaOut = _toPXA(token0, amount0).add(amount1);
        } else if (token0 == bnb) {
            // eg. ETH - USDC
            pxaOut = _toPXA(
                bnb,
                _swap(token1, bnb, amount1, address(this)).add(amount0)
            );
        } else if (token1 == bnb) {
            // eg. USDT - ETH
            pxaOut = _toPXA(
                bnb,
                _swap(token0, bnb, amount0, address(this)).add(amount1)
            );
        } else {
            // eg. MIC - USDT
            address bridge0 = bridgeFor(token0);
            address bridge1 = bridgeFor(token1);
            if (bridge0 == token1) {
                // eg. MIC - USDT - and bridgeFor(MIC) = USDT
                pxaOut = _convertStep(
                    bridge0,
                    token1,
                    _swap(token0, bridge0, amount0, address(this)),
                    amount1
                );
            } else if (bridge1 == token0) {
                // eg. WBTC - DSD - and bridgeFor(DSD) = WBTC
                pxaOut = _convertStep(
                    token0,
                    bridge1,
                    amount0,
                    _swap(token1, bridge1, amount1, address(this))
                );
            } else {
                pxaOut = _convertStep(
                    bridge0,
                    bridge1, // eg. USDT - DSD - and bridgeFor(DSD) = WBTC
                    _swap(token0, bridge0, amount0, address(this)),
                    _swap(token1, bridge1, amount1, address(this))
                );
            }
        }
    }

    function _swap(
        address fromToken,
        address toToken,
        uint256 amountIn,
        address to
    ) internal returns (uint256 amountOut) {
        IUniswapV2Pair pair =
            IUniswapV2Pair(factory.getPair(fromToken, toToken));
        require(address(pair) != address(0), "ProximaMaker: Cannot convert");
        (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
        uint256 amountInWithFee = amountIn.mul(997);
        if (fromToken == pair.token0()) {
            amountOut =
                amountIn.mul(997).mul(reserve1) /
                reserve0.mul(1000).add(amountInWithFee);
            IERC20(fromToken).safeTransfer(address(pair), amountIn);
            pair.swap(0, amountOut, to, new bytes(0));
        } else {
            amountOut =
                amountIn.mul(997).mul(reserve0) /
                reserve1.mul(1000).add(amountInWithFee);
            IERC20(fromToken).safeTransfer(address(pair), amountIn);
            pair.swap(amountOut, 0, to, new bytes(0));
        }
    }

    function _toPXA(address token, uint256 amountIn)
        internal
        returns (uint256 amountOut)
    {
        amountOut = _swap(token, pxa, amountIn, BBStorage);
    }
}
