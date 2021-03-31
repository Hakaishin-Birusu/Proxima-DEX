// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./ProximaPairGovernor.sol";
import "./ProximaTeamTokenVesting.sol";
import "./ProximaFaucet.sol";

/**
 * @title : ProximaWatchDog
 * @author : ProximusAlpha
 */

interface iERC20 {
    function symbol() external view returns (string memory);
}

contract ProximaWatchDog {
    uint256 private maxRetPerStance = 5;

    ProximaPairGovernor public governor;
    ProximaTeamTokenVesting public vesting;
    ProximaFaucet public faucet;

    uint256 public vestingId;

    struct gStruct {
        uint256 id;
        address proposer;
        address pair;
        address token0;
        address token1;
        string token0Sym;
        string token1Sym;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
    }

    constructor(
        address _vestingAddress,
        address _governorAddress,
        address _faucetAddress
    ) public {
        vesting = ProximaTeamTokenVesting(_vestingAddress);
        (, , vestingId) = vesting.getVestingStat();

        governor = ProximaPairGovernor(_governorAddress);
        faucet = ProximaFaucet(_faucetAddress);
    }

    function getAllVestings(uint256 _index)
        public
        view
        returns (
            uint256[] memory,
            ProximaTeamTokenVesting.Vesting[] memory,
            bool
        )
    {
        uint256 _iEnd;
        uint256 _itr;
        uint256 _z = 0;
        require(vestingId >= _index, "Err: index out of bounds");
        if (_index + (maxRetPerStance) <= vestingId) {
            _iEnd = _index + (maxRetPerStance);
            _itr = maxRetPerStance;
        } else {
            _iEnd = vestingId;
            _itr = vestingId - (_index);
        }

        uint256[] memory myVestID = new uint256[](_itr);
        ProximaTeamTokenVesting.Vesting[] memory myVests =
            new ProximaTeamTokenVesting.Vesting[](_itr);
        for (uint256 i = _index; i < _iEnd; i++) {
            myVestID[_z] = i;
            myVests[_z] = (vesting.getVesting(i));
            _z++;
        }
        if (_iEnd + (1) <= vestingId) {
            return (myVestID, myVests, true);
        }
        return (myVestID, myVests, false);
    }

    //on which page number you are

    function getAllActivePairs(uint256 pNum)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        uint256 pCount = governor.proposalCount();
        uint256 pSkip = pNum * maxRetPerStance;
        uint256 cSkip = 0;
        uint256 a = 0;
        uint256 b = 0;
        uint256 c = 0;
        uint256 d = 0;
        uint256 e = 0;
        uint256 zip = 0;

        for (uint256 i = pCount; i > 0; i--) {
            ProximaPairGovernor.ProposalState pState = governor.state(i);
            if (
                pState == ProximaPairGovernor.ProposalState.Active ||
                pState == ProximaPairGovernor.ProposalState.Pending
            ) {
                if (cSkip < pSkip) {
                    cSkip++;
                } else {
                    if (zip == 0) {
                        a = i;
                        zip++;
                    } else if (zip == 1) {
                        b = i;
                        zip++;
                    } else if (zip == 2) {
                        c = i;
                        zip++;
                    } else if (zip == 3) {
                        d = i;
                        zip++;
                    } else if (zip == 4) {
                        e = i;
                        break;
                    }
                }
            }
        }
        return (a, b, c, d, e);
    }

    function getAllNonActivePairs(uint256 pNum)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        uint256 pCount = governor.proposalCount();
        uint256 pSkip = pNum * maxRetPerStance;
        uint256 cSkip = 0;
        uint256 a = 0;
        uint256 b = 0;
        uint256 c = 0;
        uint256 d = 0;
        uint256 e = 0;
        uint256 zip = 0;

        for (uint256 i = pCount; i > 0; i--) {
            ProximaPairGovernor.ProposalState pState = governor.state(i);
            if (pState != ProximaPairGovernor.ProposalState.Active) {
                if (cSkip < pSkip) {
                    cSkip++;
                } else {
                    if (zip == 0) {
                        a = i;
                        zip++;
                    } else if (zip == 1) {
                        b = i;
                        zip++;
                    } else if (zip == 2) {
                        c = i;
                        zip++;
                    } else if (zip == 3) {
                        d = i;
                        zip++;
                    } else if (zip == 4) {
                        e = i;
                        break;
                    }
                }
            }
        }
        return (a, b, c, d, e);
    }

    function getActiveProposals(uint256[] memory pid, address user)
        public
        view
        returns (gStruct[] memory, ProximaPairGovernor.Receipt[] memory)
    {
        return (getProposals(pid), getUserProposalState(pid, user));
    }

    function getFinishedProposals(uint256[] memory pid, address user)
        public
        view
        returns (
            gStruct[] memory,
            ProximaPairGovernor.Receipt[] memory,
            string[] memory
        )
    {
        return (
            getProposals(pid),
            getUserProposalState(pid, user),
            getProposalStatus(pid)
        );
    }

    function getProposals(uint256[] memory pid)
        public
        view
        returns (gStruct[] memory)
    {
        gStruct[] memory myProposals = new gStruct[](pid.length);
        for (uint256 i = 0; i < pid.length; i++) {
            (
                address proposer,
                address pair,
                address token0,
                address token1,
                uint256 startBlock,
                uint256 endBlock,
                uint256 forVotes,
                uint256 againstVotes
            ) = governor.getProposalInfo(pid[i]);

            myProposals[i].proposer = proposer;
            myProposals[i].id = pid[i];
            myProposals[i].pair = pair;
            myProposals[i].token0 = token0;
            myProposals[i].token1 = token1;
            myProposals[i].token0Sym = getSymbol(token0);
            myProposals[i].token1Sym = getSymbol(token1);
            myProposals[i].startBlock = startBlock;
            myProposals[i].endBlock = endBlock;
            myProposals[i].forVotes = forVotes;
            myProposals[i].againstVotes = againstVotes;
        }

        return (myProposals);
    }

    function getSymbol(address token) public view returns (string memory) {
        return iERC20(token).symbol();
    }

    function getProposalStatus(uint256[] memory pid)
        public
        view
        returns (string[] memory)
    {
        string[] memory pRes = new string[](pid.length);
        for (uint256 i = 0; i < pid.length; i++) {
            ProximaPairGovernor.ProposalState pState = governor.state(pid[i]);
            if (pState == ProximaPairGovernor.ProposalState.Canceled) {
                pRes[i] = "Canceled";
            } else if (pState == ProximaPairGovernor.ProposalState.Challenged) {
                pRes[i] = "Challenged";
            } else if (pState == ProximaPairGovernor.ProposalState.Executed) {
                pRes[i] = "Executed";
            } else if (pState == ProximaPairGovernor.ProposalState.Succeeded) {
                pRes[i] = "Succeeded";
            } else {
                pRes[i] = "Defeated";
            }
        }
        return pRes;
    }

    function getUserProposalState(uint256[] memory pid, address user)
        public
        view
        returns (ProximaPairGovernor.Receipt[] memory)
    {
        ProximaPairGovernor.Receipt[] memory myReceipt =
            new ProximaPairGovernor.Receipt[](pid.length);
        for (uint256 i = 0; i < pid.length; i++) {
            myReceipt[i] = governor.getReceipt(pid[i], user);
        }

        return myReceipt;
    }

    function getCurrentBlock() public view returns (uint256) {
        return block.number;
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function getFaucet(address _who)
        public
        view
        returns (
            uint256 counter,
            uint256 faucetBalance,
            uint256 currentTime,
            uint256 nextTime
        )
    {
        counter = faucet.counter();
        faucetBalance = faucet.getFaucetBalance();
        currentTime = getCurrentTimestamp();
        nextTime = faucet.nextFunding(_who);
        if (nextTime <= currentTime) {
            nextTime = currentTime;
        }
    }
}
