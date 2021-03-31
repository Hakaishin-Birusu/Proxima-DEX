//SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title : ProximaFaucet
 * Developed by ProximusAlpha
 */

contract ProximaFaucet is Ownable {
    /// @dev Proxima Token
    IERC20 public pxa;
    /// @dev Claim state enum
    enum Options {Every8Hours, Every24Hours, Every72Hours}

    /// @dev Constant time window for claim
    uint256 constant hours8InSeconds = 8 * 60 * 60;
    uint256 constant hours24InSeconds = 24 * 60 * 60;
    uint256 constant hours72InSeconds = 72 * 60 * 60;

    /// @dev Constant amount window for claim
    uint256 constant hours8Fund = 0.25 ether;
    uint256 constant hours24Fund = 0.75 ether;
    uint256 constant hours72Fund = 2.25 ether;

    /// @dev Total number of claims
    uint256 private claimCounter;

    /// @dev Event emitted when claimed
    event Funded(address receiver, uint256 amount);

    /// @dev Claim time map
    mapping(address => uint256) nextFundingTime;

    /// @dev Sets pxa token
    constructor(IERC20 _pxa) public {
        pxa = _pxa;
    }

    /// @dev Transfer claimed pxa token
    function getFunds(Options _option) public {
        int256 duration = int256(nextFundingTime[msg.sender] - block.timestamp);
        require(duration < 1, "PF : FAUCET_COOLDOWN");
        if (_option == Options.Every24Hours) {
            transferFund(hours24InSeconds, hours24Fund);
        } else if (_option == Options.Every72Hours) {
            transferFund(hours72InSeconds, hours72Fund);
        } else {
            transferFund(hours8InSeconds, hours8Fund);
        }
    }

    function transferFund(uint256 _timeInSecond, uint256 _fund) private {
        require(_fund < getFaucetBalance(), "PF: FAUCET_DEPLETED");
        nextFundingTime[msg.sender] = block.timestamp + _timeInSecond;
        claimCounter++;
        pxa.transfer(msg.sender, _fund);
        emit Funded(msg.sender, _fund);
    }

    /// @dev Returns next claim time for user
    function nextFunding(address _who) public view returns (uint256) {
        return nextFundingTime[_who];
    }

    /// @dev Returns claim counter
    function counter() public view returns (uint256) {
        return claimCounter;
    }

    /// @dev Returns faucet balance
    function getFaucetBalance() public view returns (uint256) {
        return pxa.balanceOf(address(this));
    }
}
