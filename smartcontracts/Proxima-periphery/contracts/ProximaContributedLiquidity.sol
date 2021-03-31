// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./interfaces/IUniswapV2Router.sol";
import "./interfaces/IWETH.sol";

/**
 * @title : ProximaContributedLiquidity
 * Developed by ProximusAlpha
 */

contract ProximaContributedLiquidity {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    /// @dev Wrpped BNB
    IWETH public WBNB;
    /// @dev Proxima Token
    address public pxa;
    /// @dev Proxima Router
    address public router;
    /// @dev proxima Developer
    address public devaddr;
    /// @dev Total Proxima Contribution
    uint256 private totalContributedPxa;
    /// @dev Funds locking period
    uint256 private lockPeriod = 30 days;
    /// @dev Max Uint Value
    uint256 private MAX_INT =
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    /// @dev User Information struct
    struct UserInfo {
        uint256 liquidity;
        uint256 depositedBaseToken;
        uint256 contributionReceived;
        uint256 depositTime;
        uint256 unlockTime;
        bool withdrawn;
    }

    /// @dev Pool Information struct
    struct PoolInfo {
        IERC20 lpToken;
        IERC20 baseToken;
        uint256 allocPxa;
        uint256 contributedPxa;
        uint256 depositedBaseToken;
    }

    /// @dev Pool array
    PoolInfo[] private poolInfo;
    /// @dev User Info mapping
    mapping(uint256 => mapping(address => UserInfo[])) private userInfo;

    /// @dev Event emitted when deposit
    event Deposit(address indexed user, uint256 indexed pid, uint256 liquidity);
    /// @dev Event emitted when withdraw
    event Withdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 liquidity
    );

    /// @dev Sets pxa, wbnb and proxima dev address
    constructor(address _pxa, IWETH _WBNB) public {
        pxa = _pxa;
        WBNB = _WBNB;
        devaddr = msg.sender;
    }

    /// @dev Return total number of pools
    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    /// @dev Adds CL pairs, Value should be passed in wei
    function addContributedLiquidityPair(
        IERC20 _lpToken,
        IERC20 _baseToken,
        uint256 _allocPxa
    ) external returns (bool) {
        require(msg.sender == devaddr, "PCL: FORBIDDEN");
        totalContributedPxa = totalContributedPxa.add(_allocPxa);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                baseToken: _baseToken,
                allocPxa: _allocPxa,
                depositedBaseToken: 0,
                contributedPxa: 0
            })
        );
        return _baseToken.approve(router, MAX_INT);
    }

    /// @dev Adds liquidity token
    function addLiquidityToken(uint256 _pid, uint256 _amount) external {
        poolInfo[_pid].baseToken.safeTransferFrom(
            address(msg.sender),
            address(this),
            _amount
        );
        _addLiquidity(_pid, _amount);
    }

    /// @dev Adds liquidity BNB
    function addLiquidityBNB() external payable {
        require(msg.value > 0, "PCL: INSUFFIENT_SUPPLY");
        WBNB.deposit{value: msg.value}();
        _addLiquidity(0, msg.value);
    }

    function _addLiquidity(uint256 _pid, uint256 _amount) internal {
        PoolInfo storage pool = poolInfo[_pid];

        (uint256 amountA, uint256 amountB) =
            IUniswapV2Router(router).getOptimalAmount(
                address(pool.baseToken),
                address(pxa),
                _amount
            );
        require(
            amountB <= pool.allocPxa.sub(pool.contributedPxa),
            "PCL: INSUFFICIENT_CONTRIBUTION_LEFT"
        );

        (uint256 amount0, uint256 amount1, uint256 liquidity) =
            IUniswapV2Router(router).addLiquidity(
                address(pool.baseToken),
                address(pxa),
                amountA,
                amountB,
                amountA,
                amountB,
                address(this),
                block.timestamp.add(lockPeriod)
            );

        userInfo[_pid][msg.sender].push(
            UserInfo({
                liquidity: liquidity,
                depositedBaseToken: amount0,
                contributionReceived: amount1,
                depositTime: block.timestamp,
                unlockTime: block.timestamp.add(lockPeriod),
                withdrawn: false
            })
        );

        pool.contributedPxa = pool.contributedPxa.add(amount1);
        pool.depositedBaseToken = pool.depositedBaseToken.add(amount0);

        emit Deposit(msg.sender, _pid, liquidity);
    }

    /// @dev Withdraw LP tokens
    function withdrawLiquidity(uint256 _pid, uint256 _ulid) external {
        UserInfo[] memory user = userInfo[_pid][msg.sender];
        PoolInfo storage pool = poolInfo[_pid];
        require(_ulid < user.length, "PCL: OUT_OF_BOUNDS");
        require(user[_ulid].liquidity > 0, "PCL: NO_LIQUIDITY");
        require(
            user[_ulid].unlockTime <= block.timestamp,
            "PCL: TIME_UNDERBOUNDS"
        );
        require(user[_ulid].withdrawn == false, "PCL: ALREADY_WITHDRAWN");

        userInfo[_pid][msg.sender][_ulid].withdrawn = true;
        safeLiquidityTransfer(pool.lpToken, msg.sender, user[_ulid].liquidity);
        emit Withdraw(msg.sender, _pid, user[_ulid].liquidity);
    }

    /// @dev Safe transfer of LP
    function safeLiquidityTransfer(
        IERC20 _lpToken,
        address _to,
        uint256 _amount
    ) internal {
        uint256 clBal = _lpToken.balanceOf(address(this));
        if (_amount > clBal) {
            _lpToken.safeTransfer(_to, clBal);
        } else {
            _lpToken.safeTransfer(_to, _amount);
        }
    }

    /// @dev Pure Dapp function, Returns CL state
    function getStat()
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (
            totalContributedPxa,
            IERC20(pxa).balanceOf(address(this)),
            lockPeriod
        );
    }

    /// @dev Pure Dapp function, Returns user state
    function getUserStat(uint256 _pid, address _who)
        external
        view
        returns (UserInfo[] memory)
    {
        return userInfo[_pid][_who];
    }

    /// @dev Pure Dapp function, Returns pool state
    function getPoolStat(uint256 _pid) external view returns (PoolInfo memory) {
        return poolInfo[_pid];
    }

    /// @dev update proxima developer address
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "PCL: FORBIDDEN");
        devaddr = _devaddr;
    }

    /// @dev Sets router and approve contributed pxa utilization
    function setRouter(address _router) public {
        require(msg.sender == devaddr, "PCL: FORBIDDEN");
        router = _router;
        IERC20(pxa).approve(router, MAX_INT);
    }
}
