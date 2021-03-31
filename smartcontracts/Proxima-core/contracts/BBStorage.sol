// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title : BBStorage
 * Developed by ProximusAlpha
 */

contract BBStorage is Ownable {
    /// @dev Proxima Token
    IERC20 public pxa;
    /// @dev Buy-Back-Genitor address
    address public BBGenitor;

    /// @dev Set proxima Token
    constructor(IERC20 _pxa) public {
        pxa = _pxa;
    }

    /// @dev Set BBGenitor
    function setBBGenitor(address _BBGenitor) external onlyOwner {
        require(BBGenitor == address(0), "BBStorage: FORBIDDEN");
        BBGenitor = _BBGenitor;
    }

    /// @dev Move funds to BBGenitor
    function moveFunds() external {
        require(
            msg.sender == owner() && BBGenitor != address(0),
            "BBStorage: FORBIDDEN"
        );
        uint256 pxaBal = getBBStorage();
        pxa.transfer(BBGenitor, pxaBal);
    }

    /// @dev Returns balance of BBStorage
    function getBBStorage() public view returns (uint256) {
        return pxa.balanceOf(address(this));
    }
}
