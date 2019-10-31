import {NavEnhet} from "../../skjema/personopplysninger/adresse/AdresseTypes";
import {FornavnResponse, TilgangResponse} from "./soknadTypes";

export enum SoknadActionTypeKeys {
	START_SOKNAD_OK = "soknad/START_SOKNAD_OK",
	OPPRETT_SOKNAD = "soknad/OPPRETT_SOKNAD",
	OPPRETT_SOKNAD_OK = "soknad/OPPRETT_SOKNAD_OK",
	HENT_SOKNAD = "soknad/HENT_SOKNAD",
	HENT_SOKNAD_OK = "soknad/HENT_SOKNAD_OK",

	AVBRYT_SOKNAD = "soknad/AVBRYT_SOKNAD",
	FORTSETT_SOKNAD = "soknad/FORTSETT_SOKNAD",
	SLETT_SOKNAD = "soknad/SLETT_SOKNAD",
	SLETT_SOKNAD_OK = "soknad/SLETT_SOKNAD_OK",
	SEND_SOKNAD = "soknad/SEND_SOKNAD",
	SEND_SOKNAD_OK = "soknad/SEND_SOKNAD_OK",

	GET_ER_SYSTEMDATA_ENDRET = "soknad/GET_ER_SYSTEMDATA_ENDRET",
	SET_ER_SYSTEMDATA_ENDRET = "soknad/SET_ER_SYSTEMDATA_ENDRET",
	FINN_OG_OPPDATER_SOKNADSMOTTAKER_STATUS = "soknad/FINN_OG_OPPDATER_SOKNADSMOTTAKER_STATUS",
	OPPDATER_SOKNADSMOTTAKER_STATUS = "soknad/OPPDATER_SOKNADSMOTTAKER_STATUS",

	SJEKK_AUTENTISERING_OG_TILGANG_OG_HENT_RESSURSER = "soknad/SJEKK_AUTENTISERING_OG_TILGANG_OG_HENT_RESSURSER",
	LAGRE_TILGANG_OG_FORNAVN_PA_STORE = "soknad/LAGRE_RESSURSER_PA_STORE",

	SET_LINK_VISITED = "soknad/SET_LINK_VISITED",
	SHOW_LARGE_SPINNER = "soknad/SHOW_LARGE_SPINNER",
	SHOW_FEIL_SIDE = "soknad/SHOW_FEIL_SIDE",
	VIS_SAMTYKKE_INFO = "soknad/VIS_SAMTYKKE_INFO",
	UPDATE_BEHANDLINGSID_PA_STORE = "soknad/UPDATE_BEHANDLINGSID_PA_STORE",
	SHOW_SERVER_FEIL = "soknad/SHOW_SERVER_FEIL",
	SHOW_SIDE_IKKE_FUNNET = "soknad/SHOW_SIDE_IKKE_FUNNET"
}

export type AVBRYT_DESTINASJON = "START" | "MINSIDE";
// 24
export type SoknadActionType =
	| StartSoknadOkAction
	| OpprettSoknadAction
	| OpprettSoknadOkAction
	| HentSoknadAction
	| HentSoknaOkAction

	| AvbrytSoknadAction
	| FortsettSoknadAction
	| SlettSoknadAction
	| SlettSoknadOkAction
	| SendSoknadAction
	| SendSoknadOkAction

	| GetErSystemdataEndret
	| SetErSystemdataEndret
	| FinnOgOppdaterSoknadsmottakerStatus
	| OppdaterSoknadsmottakerStatus

	| SjekkAutentiseringOgTilgangOgHentRessurser
	| LagreTilgangOgFornavnPaStore

	| SetLinkVisited
	| ShowLargeSpinner
	| ShowFeilSide
	| VisSamtykkeInfo
	| UpdateBehandlingsIdPaStore
	| ShowServerFeil
	| ShowSideIkkeFunnet


export interface SjekkAutentiseringOgTilgangOgHentRessurser {
	type: SoknadActionTypeKeys.SJEKK_AUTENTISERING_OG_TILGANG_OG_HENT_RESSURSER
}

export interface LagreTilgangOgFornavnPaStore {
	type: SoknadActionTypeKeys.LAGRE_TILGANG_OG_FORNAVN_PA_STORE,
	tilgangResponse: TilgangResponse,
	fornavnResponse: FornavnResponse
}

export interface ShowLargeSpinner {
	type: SoknadActionTypeKeys.SHOW_LARGE_SPINNER,
	show: boolean
}

export interface VisSamtykkeInfo {
	type: SoknadActionTypeKeys.VIS_SAMTYKKE_INFO,
	skalVises: boolean
}


export interface FinnOgOppdaterSoknadsmottakerStatus {
	type: SoknadActionTypeKeys.FINN_OG_OPPDATER_SOKNADSMOTTAKER_STATUS,
	brukerbehandlingId: string
}

export interface OppdaterSoknadsmottakerStatus {
	type: SoknadActionTypeKeys.OPPDATER_SOKNADSMOTTAKER_STATUS,
	valgtSoknadsmottaker: NavEnhet
}

export interface StartSoknadOkAction {
	type: SoknadActionTypeKeys.START_SOKNAD_OK;
}

export interface OpprettSoknadAction {
	type: SoknadActionTypeKeys.OPPRETT_SOKNAD;
}

export interface OpprettSoknadOkAction {
	type: SoknadActionTypeKeys.OPPRETT_SOKNAD_OK;
	behandlingsId: string;
}

export interface HentSoknadAction {
	type: SoknadActionTypeKeys.HENT_SOKNAD;
	behandlingsId: string;
}

export interface HentSoknaOkAction {
	type: SoknadActionTypeKeys.HENT_SOKNAD_OK;
	xsrfCookieReceived: boolean;
	behandlingsId: string;
}

export interface SendSoknadAction {
	type: SoknadActionTypeKeys.SEND_SOKNAD;
	behandlingsId: string;
}

export interface SendSoknadOkAction {
	type: SoknadActionTypeKeys.SEND_SOKNAD_OK;
	behandlingsId: string;
}

export interface AvbrytSoknadAction {
	type: SoknadActionTypeKeys.AVBRYT_SOKNAD;
	destinasjon?: AVBRYT_DESTINASJON;
}

export interface FortsettSoknadAction {
	type: SoknadActionTypeKeys.FORTSETT_SOKNAD;
}

export interface SlettSoknadAction {
	type: SoknadActionTypeKeys.SLETT_SOKNAD;
	behandlingsId: string;
	destinasjon?: AVBRYT_DESTINASJON;
}

export interface SlettSoknadOkAction {
	type: SoknadActionTypeKeys.SLETT_SOKNAD_OK;
}

export interface GetErSystemdataEndret {
	type: SoknadActionTypeKeys.GET_ER_SYSTEMDATA_ENDRET;
	behandlingsId: string
}

export interface SetErSystemdataEndret {
	type: SoknadActionTypeKeys.SET_ER_SYSTEMDATA_ENDRET;
	erSystemdataEndret: boolean;
}

export enum ErSystemdataEndret {
	YES = "YES",
	NO = "NO",
	NOT_ASKED = "NOT_ASKED"
}

export interface SetLinkVisited {
	type: SoknadActionTypeKeys.SET_LINK_VISITED;
}

export interface ShowServerFeil {
	type: SoknadActionTypeKeys.SHOW_SERVER_FEIL;
	shouldShow: boolean
}

export interface UpdateBehandlingsIdPaStore {
	type: SoknadActionTypeKeys.UPDATE_BEHANDLINGSID_PA_STORE;
	behandlingsIdFraUrl: string;
}

export interface ShowSideIkkeFunnet {
	type: SoknadActionTypeKeys.SHOW_SIDE_IKKE_FUNNET;
	shouldShow: boolean;
}

export interface ShowFeilSide {
	type: SoknadActionTypeKeys.SHOW_FEIL_SIDE;
}