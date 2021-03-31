import { Types } from "../actions";

const initialState = {
    errorEnable: false,
    error: ""

}

export const Error = (state = initialState, action) => {
    switch (action.type) {
        case Types.ERROR_MESSAGE:
            return {
                ...state,
                error: action.error,
                errorEnable: action.errorEnable
            }
        default:
            return state;
    }
}