// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

/**
 * @title : ProximaPairGovernor
 * @dev  : Inspired from COMPOUND:
 * https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/GovernorAlpha.sol
 * Developed by ProximusAlpha
 */

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface PxaInterface {
    function getPriorVotes(address account, uint256 blockNumber)
        external
        view
        returns (uint96);
}

contract ProximaPairGovernor is Ownable {
    using SafeMath for uint256;
    /// @dev Proxima Token Instance
    PxaInterface public pxa;
    /// @dev Possible states that a proposal may be in
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Executed,
        Challenged
    }

    /// @dev  The name of this contract
    string public constant name = "Proxima Pair Governor";
    /// @dev  RewardVault address
    address public proximaLiquidityRewardVault;
    /// @dev  Factory Address
    address public factory;
    /// @dev  Proposal COunter
    uint256 public proposalCount;
    /// @dev  The EIP-712 typehash for the contract's domain
    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,uint256 chainId,address verifyingContract)"
        );
    /// @dev  The EIP-712 typehash for the ballot struct used by the contract
    bytes32 public constant BALLOT_TYPEHASH =
        keccak256("Ballot(uint256 proposalId,bool support)");

    /// @dev  Proposal storage struct
    struct Proposal {
        uint256 id;
        address proposer;
        address pair;
        address token0;
        address token1;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        bool canceled;
        bool executed;
        bool challenged;
        mapping(address => Receipt) receipts;
    }
    /// @dev  Proposal votes storage struct
    struct Receipt {
        bool hasVoted;
        bool support;
        uint96 votes;
    }
    /// @dev  The official record of all proposals ever proposed
    mapping(uint256 => Proposal) public proposals;
    /// @dev  The latest proposal for each proposer
    mapping(address => uint256) public latestProposalIds;

    ///@dev  An event emitted when a new proposal is created
    event ProposalCreated(
        uint256 id,
        address proposer,
        address pair,
        address token0,
        address token1
    );
    /// @dev  An event emitted when a vote has been cast on a proposal
    event VoteCast(
        address voter,
        uint256 proposalId,
        bool support,
        uint256 votes
    );
    /// @dev  An event emitted when a proposal has been canceled
    event ProposalChallenged(
        address indexed challenger,
        uint256 indexed originalId,
        uint256 indexed newId
    );
    /// @dev  An event emitted when a proposal has been canceled
    event ProposalCanceled(uint256 id);
    /// @dev  An event emitted when a proposal has been executed in the Timelock
    event ProposalExecuted(uint256 id);

    /// @dev  Sets mandate
    constructor(
        address _pxa,
        address _factory,
        address _proximaLiquidityRewardVault
    ) public {
        pxa = PxaInterface(_pxa);
        factory = _factory;
        proximaLiquidityRewardVault = _proximaLiquidityRewardVault;
    }

    /// @dev  Creates new proposal
    function propose(
        address _pair,
        address _token0,
        address _token1,
        address _proposer
    ) external returns (bool) {
        require(msg.sender == factory, "Err: Auth failed");
        uint256 pid = _propose(_pair, _token0, _token1, _proposer);
        emit ProposalCreated(pid, msg.sender, _pair, _token0, _token1);
        return true;
    }

    /// @dev  Challenge governance of existing proposal
    function challengeGovernance(uint256 proposalId) external returns (bool) {
        require(
            proposalCount >= proposalId && proposalId > 0,
            "Err: Invalid proposalId"
        );
        require(
            pxa.getPriorVotes(msg.sender, block.number.sub(1)) >
                proposalThreshold(),
            "Err: Proposer votes below threshold"
        );
        require(
            state(proposalId) != ProposalState.Active ||
                state(proposalId) != ProposalState.Challenged,
            "Err: Proposal Active or Challenged"
        );
        Proposal storage proposal = proposals[proposalId];
        uint256 pid =
            _propose(
                proposal.pair,
                proposal.token0,
                proposal.token1,
                msg.sender
            );
        proposal.challenged = true;
        emit ProposalChallenged(msg.sender, proposalId, pid);
        return true;
    }

    /// @dev  Execute proposal
    function execute(uint256 proposalId) external {
        bool sentiment = false;
        require(
            state(proposalId) == ProposalState.Succeeded ||
                state(proposalId) == ProposalState.Defeated,
            "Err: Proposal still pending"
        );
        if (state(proposalId) == ProposalState.Succeeded) {
            sentiment = true;
        }
        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;
        (bool success, ) =
            proximaLiquidityRewardVault.call(
                abi.encodeWithSignature(
                    "applyGovernance(address,bool)",
                    proposal.pair,
                    sentiment
                )
            );
        require(success, "Err: Transaction execution reverted.");
        emit ProposalExecuted(proposalId);
    }

    /// @dev  Cancle proposal
    function cancel(uint256 proposalId) public {
        ProposalState state = state(proposalId);
        require(
            state != ProposalState.Executed,
            "Err: Cannot cancel executed proposal."
        );
        Proposal storage proposal = proposals[proposalId];
        require(msg.sender == proposal.proposer, "Err: Invalid proposer");

        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }

    /// @dev  Caste votes for proposal
    function castVote(uint256 proposalId, bool support) public {
        return _castVote(msg.sender, proposalId, support);
    }

    /// @dev  Caste votes for proposal via signature
    function castVoteBySig(
        uint256 proposalId,
        bool support,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        bytes32 domainSeparator =
            keccak256(
                abi.encode(
                    DOMAIN_TYPEHASH,
                    keccak256(bytes(name)),
                    getChainId(),
                    address(this)
                )
            );
        bytes32 structHash =
            keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, support));
        bytes32 digest =
            keccak256(
                abi.encodePacked("\x19\x01", domainSeparator, structHash)
            );
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), "Err: Invalid signature");
        return _castVote(signatory, proposalId, support);
    }

    function _castVote(
        address voter,
        uint256 proposalId,
        bool support
    ) internal {
        require(
            state(proposalId) == ProposalState.Active,
            "Err: Voting closed"
        );
        Proposal storage proposal = proposals[proposalId];
        Receipt storage receipt = proposal.receipts[voter];
        require(receipt.hasVoted == false, "Err: Voter already voted");
        uint96 votes = pxa.getPriorVotes(voter, block.number.sub(1));

        if (support) {
            proposal.forVotes = proposal.forVotes.add(votes);
        } else {
            proposal.againstVotes = proposal.againstVotes.add(votes);
        }
        receipt.hasVoted = true;
        receipt.support = support;
        receipt.votes = votes;
        emit VoteCast(voter, proposalId, support, votes);
    }

    /// @dev  Returns proposal state
    function state(uint256 proposalId) public view returns (ProposalState) {
        require(
            proposalCount >= proposalId && proposalId > 0,
            "Err: Invalid proposal id"
        );
        Proposal storage proposal = proposals[proposalId];
        if (proposal.challenged) {
            return ProposalState.Challenged;
        } else if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (proposal.againstVotes < proposal.forVotes) {
            return ProposalState.Succeeded;
        } else {
            return ProposalState.Defeated;
        }
    }

    /// @dev  Returns chainID
    function getChainId() internal pure returns (uint256) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        return chainId;
    }

    /// @dev  Pure dapp function, returns proposal
    function getProposalInfo(uint256 proposalId)
        external
        view
        returns (
            address,
            address,
            address,
            address,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.pair,
            proposal.token0,
            proposal.token1,
            proposal.startBlock,
            proposal.endBlock,
            proposal.forVotes,
            proposal.againstVotes
        );
    }

    /// @dev  Pure dapp function, Returns user support on proposal
    function getReceipt(uint256 proposalId, address voter)
        public
        view
        returns (Receipt memory)
    {
        return proposals[proposalId].receipts[voter];
    }

    /// @dev  The number of votes required in order for a voter to become a proposer
    function proposalThreshold() public pure returns (uint256) {
        return 100000e18;
        // 100000 votes;
    }

    /// @dev  The delay before voting on a proposal may take place, once proposed
    function votingDelay() public pure returns (uint256) {
        return 1;
    } // 1 block

    /// @dev  The duration of voting on a proposal, in blocks
    function votingPeriod() public pure returns (uint256) {
        return 86400;
    } // 3 sec block time (~ 3 days)

    function _propose(
        address _pair,
        address _token0,
        address _token1,
        address _proposer
    ) internal returns (uint256) {
        require(
            _pair != address(0) &&
                _token0 != address(0) &&
                _token1 != address(0) &&
                _proposer != address(0),
            "Err: Invalid request"
        );
        uint256 startBlock = block.number.add(votingDelay());
        uint256 endBlock = startBlock.add(votingPeriod());

        proposalCount++;
        Proposal memory newProposal =
            Proposal({
                id: proposalCount,
                proposer: _proposer,
                pair: _pair,
                token0: _token0,
                token1: _token1,
                startBlock: startBlock,
                endBlock: endBlock,
                forVotes: 0,
                againstVotes: 0,
                canceled: false,
                executed: false,
                challenged: false
            });

        proposals[newProposal.id] = newProposal;
        latestProposalIds[newProposal.proposer] = newProposal.id;
        return newProposal.id;
    }
}
