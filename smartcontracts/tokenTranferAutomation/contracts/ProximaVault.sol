// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title : ProximaVault
 * @author : ProximusAlpha
 */

contract ProximaVault is Ownable {
    /// @dev Proxima Token instance
    IERC20 public pxa;
    /// @dev Flag that represents initialization of vault
    bool initialized = false;

    /// @dev An event thats emitted when Pxa tokens are released.
    event PublicReleaseNotification(
        address releasedTo,
        uint256 releasedAmount,
        bytes32 purpose
    );

    /**
     * @dev Initilizes the proxima vault. Can be called only once.
     * @param _pxa Proxima Token
     */
    function initVault(IERC20 _pxa) public onlyOwner {
        require(initialized == false, "Err: Vault already Initialized");
        pxa = _pxa;
        initialized = true;
    }

    /**
     * @dev Releases Proxima token to specified destination.
     * @param _to Pxa released to.
     * @param _amount Amount of Pxa released.
     * @param _purpose Purpose of Pxa release.
     */
    function release(
        address _to,
        uint256 _amount,
        bytes32 _purpose
    ) public onlyOwner {
        require(initialized == true, "Err: Vault not Initialized");
        pxa.transfer(_to, _amount);
        emit PublicReleaseNotification(_to, _amount, _purpose);
    }
}
