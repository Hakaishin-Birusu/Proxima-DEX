// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

interface IFactory {
    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);
}

/**
 * @title : ProximaLiquidityRewardVault
 * Developed by ProximusAlpha
 */

contract ProximaLiquidityRewardVault {
    using SafeMath for uint256;
    /// @dev Proxima Token
    IERC20 public pxa;
    /// @dev Proxima Governor
    address public governance;
    /// @dev Proxima Router
    address public router;
    /// @dev Proxima Factory
    address public factory;
    /// @dev Proxima developer
    address public setter;
    /// @dev Pending pxa rewards
    uint256 private totalPendingRewards;
    /// @dev div const
    uint256 private denominator = 10000000;

    /// @dev Event emitted when new rewards are locked
    event rewardLocked(address[] pairs, address user, uint256 totalLocked);
    /// @dev Event emitted when LP retrieves rewards via pair
    event pairRewardClaim(address releasedTo, uint256 releasedAmount);
    /// @dev Event emitted when user withdraw rewards
    event userRewardClaim(address indexed releasedTo, uint256 releasedAmount);

    /// @dev Whitelist map
    mapping(address => bool) public whiteListedPairs;
    /// @dev Pair pending rewardmap
    mapping(address => uint256) public pairPendingRewards;
    /// @dev User pending reward map
    mapping(address => uint256) public userPendingRewards;

    /// @dev Governance modifier
    modifier onlyGovernance() {
        require(msg.sender == governance, "PLRV: Not governance ");
        _;
    }
    /// @dev Router modifier
    modifier onlyRouter() {
        require(msg.sender == router, "PLRV: Not router ");
        _;
    }

    /// @dev Sets mandate
    constructor(IERC20 _pxa, address _setter) public {
        pxa = _pxa;
        setter = _setter;
        totalPendingRewards = 0;
    }

    /// @dev Locks trade rewards for user and LP of pair(s)
    function lockShares(address[] memory pairs, address _who)
        external
        onlyRouter
        returns (bool)
    {
        uint256 totalPairAllocation = 0;

        for (uint8 i = 0; i < pairs.length - 1; i++) {
            address forPair = IFactory(factory).getPair(pairs[i], pairs[i + 1]);
            if (whiteListedPairs[forPair] == true) {
                uint256 pairShare = getCurrentDistribution();
                totalPairAllocation = totalPairAllocation.add(pairShare);
                totalPendingRewards = totalPendingRewards.add(pairShare);
                pairPendingRewards[forPair] = pairPendingRewards[forPair].add(
                    pairShare
                );
            }
        }
        if (totalPairAllocation > 0) {
            uint256 userShare = totalPairAllocation.div(pairs.length);
            if (pairs.length <= 2) {
                userShare = userShare.div(2); // direct pair trade reward correction
            }
            totalPendingRewards = totalPendingRewards.add(userShare);
            userPendingRewards[_who] = userPendingRewards[_who].add(userShare);
            totalPairAllocation = totalPairAllocation.add(userShare);
        }
        emit rewardLocked(pairs, _who, totalPairAllocation);
        return true;
    }

    /// @dev Release accu. rewards for pair
    function releasePairShare() external returns (bool) {
        uint256 pairShare = pairPendingRewards[msg.sender];
        require(pairShare > 0, "PLRV: No pending rewards");
        pairPendingRewards[msg.sender] = 0;
        safePxaTransfer(msg.sender, pairShare);
        totalPendingRewards = totalPendingRewards.sub(pairShare);
        emit pairRewardClaim(msg.sender, pairShare);
        return true;
    }

    /// @dev Release accu. rewards for user
    function releaseUserShare() external returns (bool) {
        uint256 userShare = userPendingRewards[msg.sender];
        require(userShare > 0, "PLRV: No pending rewards");
        userPendingRewards[msg.sender] = 0;
        safePxaTransfer(msg.sender, userShare);
        totalPendingRewards = totalPendingRewards.sub(userShare);
        emit userRewardClaim(msg.sender, userShare);
        return true;
    }

    /// @dev Sets governance on pair
    function applyGovernance(address pair, bool sentiment)
        external
        onlyGovernance
        returns (bool)
    {
        uint256 pairShare = pairPendingRewards[pair];
        if (pairShare > 0) {
            pairPendingRewards[pair] = 0;
            safePxaTransfer(pair, pairShare);
            totalPendingRewards = totalPendingRewards.sub(pairShare);
        }
        if (sentiment) {
            return sewPairSupply(pair);
        } else {
            return slashPairSupply(pair);
        }
    }

    function sewPairSupply(address pair) internal returns (bool) {
        whiteListedPairs[pair] = true;
        return true;
    }

    function slashPairSupply(address pair) internal returns (bool) {
        whiteListedPairs[pair] = false;
        return true; /// @dev Release accu. rewards for pair
    }

    /// @dev Whilelist pairs directly
    function exemptedPair(address _pair) external returns (bool) {
        require(msg.sender == factory, "PLRV : FORBIDDEN");
        return sewPairSupply(_pair);
    }

    /// @dev Safe pxa token transfer
    function safePxaTransfer(address _to, uint256 _amount) internal {
        uint256 PxaBal = safeBalance();
        if (_amount > PxaBal) {
            pxa.transfer(_to, PxaBal);
        } else {
            pxa.transfer(_to, _amount);
        }
    }

    /// @dev Returns current reward distribution . Calculated by x percent of reward pools total weight
    function getCurrentDistribution() public view returns (uint256) {
        uint256 safeAmount = (safeBalance()).sub(totalPendingRewards);
        uint256 numerator = safeAmount.mul(8);
        uint256 share = numerator / denominator;
        return (share);
    }

    /// @dev Returns rewardVault balance
    function safeBalance() public view returns (uint256) {
        return pxa.balanceOf(address(this));
    }

    /// @dev Ruturns user pending rewards
    function getUserPendingShares(address _who)
        external
        view
        returns (uint256)
    {
        return userPendingRewards[_who];
    }

    /// @dev Returns Pair pending rewards
    function getPairPendingShares(address _who)
        external
        view
        returns (uint256)
    {
        return pairPendingRewards[_who];
    }

    /// @dev Sets Governance
    function setPairGovernor(address _governance) external {
        require(msg.sender == setter, "PLRV: FORBIDDEN");
        governance = _governance;
    }

    /// @dev Sets proxima developer address
    function setSetter(address _setter) external {
        require(msg.sender == setter, "PLRV: FORBIDDEN");
        setter = _setter;
    }

    /// @dev Sets Proxima router
    function setRouter(address _router) external {
        require(msg.sender == setter, "PLRV: FORBIDDEN");
        router = _router;
    }

    /// @dev Sets Proxima factory
    function setFactory(address _factory) external {
        require(msg.sender == setter, "PLRV: FORBIDDEN");
        factory = _factory;
    }
}
