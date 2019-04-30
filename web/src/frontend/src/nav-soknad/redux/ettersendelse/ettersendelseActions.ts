import { EttersendelseActionTypeKeys, EttersendelseActionTypes } from "./ettersendelseTypes";
import { detekterInternFeilKode } from "../../utils/rest-utils";

const slettEttersendtVedlegg = (vedleggId: string, filId: string): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.SLETT_VEDLEGG,
		vedleggId,
		filId
	};
};

const opprettEttersendelse = (brukerbehandlingId: string): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.NY,
		brukerbehandlingId
	};
};

const opprettEttersendelseFeilet = (brukerbehandlingId: string): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.NY_FEILET,
		brukerbehandlingId
	};
};

const lastOppEttersendelseVedlegg = (
	vedleggId: number,
	formData: FormData
): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.LAST_OPP,
		vedleggId,
		formData
	};
};

const lagEttersendelseOk = (brukerbehandlingId: string): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.NY_OK,
		brukerbehandlingId
	};
};

const lastOppEttersendtVedleggOk = (): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.LAST_OPP_OK
	};
};

const lastOppEttersendelseFeilet = (feilKode: string, vedleggId: string): EttersendelseActionTypes => {
	const internFeilKode = detekterInternFeilKode(feilKode);
	return {
		type: EttersendelseActionTypeKeys.LAST_OPP_FEILET,
		feilKode: internFeilKode,
		vedleggId
	};
};

const lesEttersendteVedlegg = (vedlegg: any) => {
	return {
		type: EttersendelseActionTypeKeys.LES_ETTERSENDELSES_VEDLEGG_OK,
		vedlegg
	};
};

const lesEttersendelsesVedlegg = (brukerbehandlingId: string): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.LES_ETTERSENDELSES_VEDLEGG,
		brukerbehandlingId
	};
};

const sendEttersendelse = (brukerbehandlingId: string): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.SEND,
		brukerbehandlingId
	};
};

const lesEttersendelser = (brukerbehandlingId: string): EttersendelseActionTypes => {
	return {
		type: EttersendelseActionTypeKeys.LES_ETTERSENDELSER,
		brukerbehandlingId
	};
};

const settEttersendelser = () => {
	return {
		type: EttersendelseActionTypeKeys.LES_ETTERSENDELSER_OK,
	};
};

export {
	opprettEttersendelse,
	opprettEttersendelseFeilet,
	lagEttersendelseOk,
	lesEttersendelsesVedlegg,
	lastOppEttersendelseVedlegg,
	lastOppEttersendtVedleggOk,
	lastOppEttersendelseFeilet,
	slettEttersendtVedlegg,
	lesEttersendteVedlegg,
	lesEttersendelser,
	sendEttersendelse,
	settEttersendelser
};
