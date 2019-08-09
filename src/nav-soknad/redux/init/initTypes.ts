import { REST_STATUS } from "../../types";

export enum InitActionTypeKeys {
	INIT = "init/INIT",
	START = "init/START",
	OK = "init/OK",
	FEILET = "init/FEILET",
	SET_VIS_SAMTYKKE_INFO = "init/SET_VIS_SAMTYKKE_INFO",
}

export type InitActionTypes =
	StartAction
	| FerdigAction
	| FeiletAction
	| VisSamtykkeInfoAction;

interface StartAction {
	type: InitActionTypeKeys.START;
}

interface FerdigAction {
	type: InitActionTypeKeys.OK;
}

interface FeiletAction {
	type: InitActionTypeKeys.FEILET;
}

interface VisSamtykkeInfoAction {
	type: InitActionTypeKeys.SET_VIS_SAMTYKKE_INFO;
	visSamtykkeInfo: boolean;
}

export interface InitState {
	restStatus: REST_STATUS;
	visSamtykkeInfo: boolean;
}