import {Dispatch} from "../reduxTypes";
import {fetchToJson} from "../../utils/rest-utils";
import {navigerTilServerfeil} from "../navigasjon/navigasjonActions";
import {
    opplysningerAction,
    opplysningerActionTypeKeys,
    OpplysningerBackend,
    Opplysning,
    OpplysningType
} from "./opplysningerTypes";
import {getOpplysningerUrl} from "./opplysningerUtils";
import {Valideringsfeil} from "../../validering/types";


export const gotDataFromBackend = (response: OpplysningerBackend): opplysningerAction => {
    return {
        type: opplysningerActionTypeKeys.GOT_DATA_FROM_BACKEND,
        backendData: response
    }
};

export const updateOpplysning = (opplysning: Opplysning): opplysningerAction => {
    return {
        type: opplysningerActionTypeKeys.OPPDATER_OPPLYSNING,
        opplysning
    }
};

export const settPendingPaFilOpplasting = (opplysningType: OpplysningType): opplysningerAction => {
    return {
        type: opplysningerActionTypeKeys.SETT_PENDING_PA_FIL_OPPLASTING,
        opplysningType,
    }
};

export const settFerdigPaFilOpplasting = (opplysningType: OpplysningType): opplysningerAction => {
    return {
        type: opplysningerActionTypeKeys.SETT_FERDIG_PA_FIL_OPPLASTING,
        opplysningType,
    }
};

export function hentOpplysninger(behandlingsId: string) {
    return (dispatch: Dispatch) => {
        fetchToJson(getOpplysningerUrl(behandlingsId))
            .then((response: OpplysningerBackend) => {
                dispatch(gotDataFromBackend(response));
            }).catch(() => {
            dispatch(navigerTilServerfeil());
        });
    }
}

export const lagreOpplysningHvisGyldigAction = (
    behandlingsId: string,
    opplysning: Opplysning,
    feil: Valideringsfeil[]
): opplysningerAction => {
    return {
        type: opplysningerActionTypeKeys.LAGRE_OPPLYSNING_HVIS_GYLDIG,
        behandlingsId,
        opplysning,
        feil
    }
};