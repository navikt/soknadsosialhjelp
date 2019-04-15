import {Fil, Opplysning, OpplysningType} from "../okonomiskeOpplysninger/okonomiskeOpplysningerTypes";
import {FilActionTypeKeys, FilActionTypes} from "./filTypes";
import {REST_FEIL} from "../../types/restFeilTypes";

const lastOppFil = (
	opplysning: Opplysning,
	formData: FormData,
	behandlingsId: string,
	opplysningType: OpplysningType
): FilActionTypes => {
	return {
		type: FilActionTypeKeys.LAST_OPP,
		opplysning,
		formData,
		behandlingsId,
		opplysningType
	};
};


const lastOppFilFeilet = (opplysningType: OpplysningType, feilKode: REST_FEIL): FilActionTypes => {
    return {
        type: FilActionTypeKeys.LAST_OPP_FEILET,
        opplysningType,
        feilKode
    };
};

const startSlettFil = (
    behandlingsId: string,
	fil: Fil,
	opplysning: Opplysning,
	opplysningType: OpplysningType
):  FilActionTypes => {
	return {
		type: FilActionTypeKeys.START_SLETT_FIL,
		behandlingsId,
		fil,
		opplysning,
		opplysningType
	};
};

export {
	lastOppFil,
	startSlettFil,
	lastOppFilFeilet
};