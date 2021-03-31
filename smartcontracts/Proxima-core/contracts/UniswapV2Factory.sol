// SPDX-License-Identifier: GPL-3.0

pragma solidity =0.6.12;

import "./interfaces/IUniswapV2Factory.sol";
import "./UniswapV2Pair.sol";

interface IProximaPairGovernor {
    function propose(
        address _pair,
        address _token0,
        address _token1,
        address _proposer
    ) external returns (bool);
}

interface IProximaLiquidityRewardVault {
    function exemptedPair(address _pair) external returns (bool);
}

contract UniswapV2Factory is IUniswapV2Factory {
    address public override feeTo;
    address public override feeToSetter;
    address public override proximaToken;
    address public override rewardVault;
    address public override pairGovernor;
    address public override router;
    address public override migrator;

    mapping(address => mapping(address => address)) public override getPair;
    address[] public override allPairs;

    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    constructor(
        address _feeToSetter,
        address _proximaToken,
        address _rewardVault
    ) public {
        feeToSetter = _feeToSetter;
        proximaToken = _proximaToken;
        rewardVault = _rewardVault;
    }

    function allPairsLength() external view override returns (uint256) {
        return allPairs.length;
    }

    function pairCodeHash() external pure returns (bytes32) {
        return keccak256(type(UniswapV2Pair).creationCode);
    }

    function createPair(
        address tokenA,
        address tokenB,
        address proposer,
        bool pairGovernance
    ) external override returns (address pair) {
        bool pRes;
        if (router != address(0)) {
            require(
                msg.sender == router || msg.sender == migrator,
                "UniswapFactory: FORBIDDEN"
            );
        }
        require(tokenA != tokenB, "UniswapFactory: IDENTICAL_ADDRESSES");
        (address token0, address token1) =
            tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "UniswapFactory: ZERO_ADDRESS");
        require(
            getPair[token0][token1] == address(0),
            "UniswapFactory: PAIR_EXISTS"
        ); // single check is sufficient
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        UniswapV2Pair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        if (pairGovernance) {
            pRes = IProximaPairGovernor(pairGovernor).propose(
                pair,
                token0,
                token1,
                proposer
            );
            require(pRes == true, "UnswapV2: PROPOSAL_FAILED");
        } else {
            pRes = IProximaLiquidityRewardVault(rewardVault).exemptedPair(pair);
            require(pRes == true, "UnswapV2: EXEMPTION_FAILED");
        }
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, "UniswapFactory: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setMigrator(address _migrator) external override {
        require(msg.sender == feeToSetter, "UniswapFactory: FORBIDDEN");
        migrator = _migrator;
    }

    function setRouter(address _router) external override {
        require(msg.sender == feeToSetter, "UniswapFactory: FORBIDDEN");
        router = _router;
    }

    function setPairGovernor(address _pairGovernor) external override {
        require(msg.sender == feeToSetter, "UniswapFactory: FORBIDDEN");
        pairGovernor = _pairGovernor;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, "UniswapFactory: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}
