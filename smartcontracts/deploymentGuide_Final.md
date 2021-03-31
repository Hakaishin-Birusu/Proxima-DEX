## Correct following assuptions before moving to prod

Points to remember while deploying

# Contributed Liquidity

1. Update time fro 5 mins to 30 days => done
2. set router

# Proxima Faucet

1. update commented withdraw time limit => done

# Governance

1. Update voting period ===> done

# Team Token Vesting

1. Update vesting day value fromm 5 mins to 1 days => done

=======================================================================================================

## Steps

1. Get PXA token and PxaVault address.
2. Update migration file of PxaTeamTokenVesting for PXA token address, and deploy ProximaTeamTokenVesting.
3. Update Migration file of ProximaCore for PXA token and ProximaTeamTokenVesting address and deploy proxima core contracts.
   ==================== UPDATE INIT HASH CODE IN UNISWAP LIBRARY==================
4. Update migration file of Proxima Periphery for Pxa Token, factory, reward vault, cLiquidity addresses . and deploy proxima periphery
5. Update migration file of TokenTransferRepo ad update Pxa token, Pxa vault, cLiquidity, reward vault, team token, faucet, bootstrap addresses. and deploy the TokenTransferRepo
   ==========================check for correct number of tokens tranfered manually==============
6. Update migration of exempted pair repo for factory and router address . and deploy exempted pairs

external -

1. manually start goverance in router smart contract

=========================================================================================================

## Cost estimation (Folder wise)

1. Team token vesting : 0.14772096 BNB
2. Proxima -core : 0.2215995 BNB
3. Proxima -Periphery : 0.06790506 BNB
4. Token Transfer Automation : 0.00307412 BNB
5. Execmpted Pair Automation : 2.307412 BNB

===========================================================================================================
