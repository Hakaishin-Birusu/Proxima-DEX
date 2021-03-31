// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

/**
 * @title ProximaTeamTokenVesting
 * @author ProximusAlpha
 */
contract ProximaTeamTokenVesting is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /// @dev Proxima Token
    IERC20 private proximaToken;

    /// @dev Number of token added for vesting
    uint256 private totalTokenToVest;

    /// @dev Number of tokens released
    uint256 private totalTokenReleased;

    /// @dev Vesting ID
    uint256 private vestingId;

    /// @dev Vesting state struct
    struct Vesting {
        address beneficiary;
        uint256 releaseTime;
        uint256 amount;
        bool released;
    }

    /// @dev Vesting map
    mapping(uint256 => Vesting) private vestings;

    /// @dev An event thats emitted on vesting release
    event TokenVestingReleased(
        uint256 indexed vestingId,
        address indexed beneficiary,
        uint256 amount
    );
    /// @dev An event thats emitted on new vesting
    event TokenVestingAdded(
        uint256 indexed vestingId,
        address indexed beneficiary,
        uint256 amount
    );
    /// @dev EAn event thats emitted on vesting removal
    event TokenVestingRemoved(
        uint256 indexed vestingId,
        address indexed beneficiary,
        uint256 amount
    );

    /**
     * @dev Initializer
     * @param _token : Proxima token
     */
    constructor(IERC20 _token) public {
        require(address(_token) != address(0x0), "Err: Invalid token address");
        proximaToken = _token;
        totalTokenToVest = 0;
        vestingId = 0;
            uint256 SCALING_FACTOR = 10**18;
            uint256 day = 1 days;
            

        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 0, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 0, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 0, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 0, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 0, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 30 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 30 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 30 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 30 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 30 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 60 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 60 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 60 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 60 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 60 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 90 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 90 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 90 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 90 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 90 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 120 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 120 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 120 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 120 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 120 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 150 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 150 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 150 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 150 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 150 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 180 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 180 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 180 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 180 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 180 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 210 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 210 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 210 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 210 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 210 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 240 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 240 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 240 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 240 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 240 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 270 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 270 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 270 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 270 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 270 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 300 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 300 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 300 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 300 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 300 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 330 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 330 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 330 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 330 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 330 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 360 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 360 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 360 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 360 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 360 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 390 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 390 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 390 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 390 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 390 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 420 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 420 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 420 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 420 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 420 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 450 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 450 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 450 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 450 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 450 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 480 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 480 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 480 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 480 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 480 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x690a4f012C626339083c5a920e3f767152737316, now + 510 * day, 11111 * SCALING_FACTOR);
        addNewVesting(0xc2C746849Fe4C56fCE5934AFCb561947032E830C, now + 510 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x760D4836Bbf9f2587726F95C191469288B2f7E17, now + 510 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0xeBB646657E045de7c8209b38479303806D917780, now + 510 * day, 8333 * SCALING_FACTOR);
        addNewVesting(0x1f606F8f1AB545B65795b2a09b8ae9343343EDCD, now + 510 * day, 8333 * SCALING_FACTOR);
    }

    /**
     * @dev Remove vesting from queue.Owner/Governance callable
     * @param _vestingId : Vesting ID
     */
    function removeVesting(uint256 _vestingId) public onlyOwner {
        Vesting storage vesting = vestings[_vestingId];
        require(vesting.beneficiary != address(0x0), "Err: Invalid vestingID");
        require(!vesting.released, "Err: Vesting already released");
        vesting.released = true;
        totalTokenToVest = totalTokenToVest.sub(vesting.amount);
        emit TokenVestingRemoved(
            _vestingId,
            vesting.beneficiary,
            vesting.amount
        );
    }

    /**
     * @dev Adds new vesting
     * @param _beneficiary : Vesting beneficiary address
     * @param _releaseTime : Vesting Release time
     * @param _amount : Vesting amount
     */
    function addNewVesting(
        address _beneficiary,
        uint256 _releaseTime,
        uint256 _amount
    ) internal {
        require(_beneficiary != address(0x0), "Err: Invalid beneficiary");
        totalTokenToVest = totalTokenToVest.add(_amount);
        vestings[vestingId] = Vesting({
            beneficiary: _beneficiary,
            releaseTime: _releaseTime,
            amount: _amount,
            released: false
        });
        vestingId = vestingId.add(1);
        emit TokenVestingAdded(vestingId, _beneficiary, _amount);
    }

    /**
     * @dev Release vesting. Can be called by anyone
     * @param _vestingId : Vesting ID
     */
    function releaseVesting(uint256 _vestingId) public {
        Vesting storage vesting = vestings[_vestingId];
        require(vesting.beneficiary != address(0x0), "Err: Invalid vestingID");
        require(!vesting.released, "Err: Vesting already released");
        // solhint-disable-next-line not-rely-on-time
        require(
            block.timestamp >= vesting.releaseTime,
            "Err: Tokens not vested yet"
        );
        require(getPxaBalance() >= vesting.amount, "Err: Insufficient funds");
        vesting.released = true;
        totalTokenReleased = totalTokenReleased.add(vesting.amount);
        totalTokenToVest = totalTokenToVest.sub(vesting.amount);
        proximaToken.safeTransfer(vesting.beneficiary, vesting.amount);
        emit TokenVestingReleased(
            _vestingId,
            vesting.beneficiary,
            vesting.amount
        );
    }

    /**
     * @param _vestingId : Vesting ID
     * @return Beneficiary address of supplied VestingID
     */
    function getVesting(uint256 _vestingId)
        external
        view
        returns (Vesting memory)
    {
        require(_vestingId <= vestingId, "Err: Out of bounds");
        return vestings[_vestingId];
    }

    /**
     * @return vesting state vars
     */
    function getVestingStat()
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (totalTokenToVest, totalTokenReleased, vestingId);
    }

    /**
     * @return PXA balance of contract
     */
    function getPxaBalance() public view returns (uint256) {
        return (proximaToken.balanceOf(address(this)));
    }

    /**
     * @dev Retrieves excess tokens from contract. Owner/Governance callable
     * @param _amount : Amount to be withdrawn
     */
    function retrieveExcessTokens(uint256 _amount) public onlyOwner {
        require(
            _amount <= getPxaBalance().sub(totalTokenToVest),
            "Err: Insufficient funds"
        );
        proximaToken.safeTransfer(owner(), _amount);
    }
}