import { REST_STATUS } from "../../types/restTypes";
import { Reducer } from "../reduxTypes";
import {FilActionTypeKeys, FilActionTypes, FilState} from "./filTypes";

const initialState: FilState = {
    opplastingStatus: REST_STATUS.OK,
    feilKode: null
};

const FilReducer: Reducer<FilState, FilActionTypes> = (
    state = initialState,
    action
): FilState => {
    switch (action.type) {
        case FilActionTypeKeys.LAST_OPP: {
            return {
                ...state,
                opplastingStatus: REST_STATUS.PENDING,
            };
        }
        case FilActionTypeKeys.LAST_OPP_FEILET: {
            return {
                ...state,
                opplastingStatus: REST_STATUS.FEILET,
                feilKode: action.feilKode
            };
        }
        default:
            return state;
    }

};

export default FilReducer;
