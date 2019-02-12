import { Dispatch } from "../reduxTypes";
import { fetchPut, fetchToJson } from "../../utils/rest-utils";
import { oppdaterSoknadsdataState, SoknadsdataType } from "./soknadsdataReducer";
import { navigerTilServerfeil } from "../navigasjon/navigasjonActions";

const soknadsdataUrl = (brukerBehandlingId: string, sti: string): string => `soknader/${brukerBehandlingId}/${sti}`;

// // TODO Deprecated ... slett
export function fetchSoknadsdataAction(brukerBehandlingId: string, sti: string) {
	return (dispatch: Dispatch) => {
		fetchToJson(soknadsdataUrl(brukerBehandlingId, sti)).then((response: any) => {
			const soknadsdata = setPath({}, sti, response);
			dispatch(oppdaterSoknadsdataState(soknadsdata));
		}).catch(() => {
			dispatch(navigerTilServerfeil());
		});
	}
}

export function hentSoknadsdata(brukerBehandlingId: string, sti: string) {
	return (dispatch: Dispatch) => {
		fetchToJson(soknadsdataUrl(brukerBehandlingId, sti)).then((response: any) => {
			const soknadsdata = setPath({}, sti, response);
			dispatch(oppdaterSoknadsdataState(soknadsdata));
		}).catch(() => {
			dispatch(navigerTilServerfeil());
		});
	}
}

// TODO Deprecated...slett
export function fetchPutSoknadsdataAction(brukerBehandlingId: string, sti: string, soknadsdata: any) { // TODO: Sett type til SoknadsdataType
	return (dispatch: Dispatch) => {
		fetchPut(soknadsdataUrl(brukerBehandlingId, sti), JSON.stringify(soknadsdata)).then(() => {
			const payload: any = {};
			payload[sti] = soknadsdata;
			dispatch(oppdaterSoknadsdataState(payload));
		}).catch(() => {
			dispatch(navigerTilServerfeil());
		});
	}
}

export function lagreSoknadsdata(brukerBehandlingId: string, sti: string, soknadsdata: any) {
	return (dispatch: Dispatch) => {
		fetchPut(soknadsdataUrl(brukerBehandlingId, sti), JSON.stringify(soknadsdata)).then(() => {
			const payload: any = {};
			payload[sti] = soknadsdata;
			dispatch(oppdaterSoknadsdataState(payload));
		}).catch(() => {
			dispatch(navigerTilServerfeil());
		});
	}
}

export function lagreSoknadsdataTypet(brukerBehandlingId: string, sti: string, soknadsdata: SoknadsdataType) {
	return lagreSoknadsdata(brukerBehandlingId, sti, soknadsdata);
}

/*
 * setPath - Opprett element i object ut fra sti hvis det ikke finnes.
 *
 * setPath( {}, 'familie/sivilstatus/status/barn', {navn: "Doffen"});
 *  => { familie: { sivilstatus: { status: {barn: {navn: 'Doffen' } } } }
 *
 * setPath( {}, 'familie/barn/0', {navn: "Doffen"})
 *  => {familie: {barn : [{navn: "Doffen"}]
 */
export const setPath = (obj: any, path: string, value: any): any => {
	obj = typeof obj === 'object' ? obj : {};
	const keys = Array.isArray(path) ? path : path.split('/');
	let curStep = obj;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!curStep[key] && !Object.prototype.hasOwnProperty.call(curStep, key)){
			const nextKey = keys[i+1];
			const useArray = /^\+?(0|[1-9]\d*)$/.test(nextKey);
			curStep[key] = useArray ? [] : {};
		}
		curStep = curStep[key];
	}
	const finalStep = keys[keys.length - 1];
	curStep[finalStep] = value;
	return obj;
};