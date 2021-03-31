import { Init } from "./init";
import { SwapInstance } from "./swapInit";

import { GovernanceInstance } from "./governanceInit";

export const SwapContractInstance = SwapInstance();

export const GovernanceContractInstance = GovernanceInstance();

export const StakingInstance = Init();
