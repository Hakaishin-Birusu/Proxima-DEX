import { Types } from "../actions";

const initialState = {
    votes: "",
    activePairs: [],
    finishedPairs: []

}

export const Pairs = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_VOTES:
            return {
                ...state,
                votes: action.value
            }
        case Types.GET_ACTIVE_PAIRS:
            return {
                ...state,
                activePairs: action.value
            }
        case Types.GET_FINISHED_PAIRS:
            return {
                ...state,
                finishedPairs: action.value
            }

        default:
            return state;
    }
}