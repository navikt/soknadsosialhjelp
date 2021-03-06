import {SagaIterator} from "redux-saga";
import {call, put, takeEvery} from "redux-saga/effects";
import {
    fetchDelete,
    fetchPost,
    fetchToJson,
    getInnsynUrl,
    HttpStatus,
    lastNedForsendelseSomZipFilHvisMockMiljoEllerDev,
} from "../../../nav-soknad/utils/rest-utils";
import {
    Samtykke,
    FinnOgOppdaterSoknadsmottakerStatus,
    GetErSystemdataEndret,
    HentSamtykker,
    HentSoknadAction,
    SendSoknadAction,
    SlettSoknadAction,
    SoknadActionTypeKeys,
} from "./soknadActionTypes";
import {navigerTilDittNav, navigerTilKvittering, tilStart, tilSteg} from "../navigasjon/navigasjonActions";

import {
    hentSamtykkerOk,
    hentSoknadOk,
    lagreNedetidPaStore,
    lagreRessurserPaStore,
    oppdaterSoknadsmottakerStatus,
    opprettSoknadFeilet,
    opprettSoknadOk,
    sendSoknadOk,
    setErSystemdataEndret,
    setSendSoknadServiceUnavailable,
    showFeilSide,
    showLargeSpinner,
    showSendingFeiletPanel,
    showServerFeil,
    showSideIkkeFunnet,
    slettSoknadOk,
    startSoknadOk,
    startSoknadServiceUnavailable,
    visMidlertidigDeaktivertPanel,
    visNedetidPanel,
} from "./soknadActions";
import {loggAdvarsel, loggInfo} from "../navlogger/navloggerActions";
import {NavEnhet} from "../../skjema/personopplysninger/adresse/AdresseTypes";
import {SoknadsSti} from "../soknadsdata/soknadsdataReducer";
import {push} from "connected-react-router";
import {
    FornavnResponse,
    LedeteksterResponse,
    MiljovariablerResponse,
    NedetidResponse,
    OpprettSoknadResponse,
    SendSoknadResponse,
    TilgangResponse,
} from "./soknadTypes";
import {lagreLedeteksterPaStore} from "../ledetekster/ledeteksterActions";
import {lagreMiljovariablerPaStore} from "../miljovariabler/miljovariablerActions";
import {soknadsdataUrl} from "../soknadsdata/soknadsdataActions";

enum SendtTilSystemEnum {
    SVARUT = "SVARUT",
    FIKS_DIGISOS_API = "FIKS_DIGISOS_API",
}

function* sjekkAutentiseringOgTilgangOgHentRessurserSaga() {
    try {
        const tilgangResponse: TilgangResponse = yield call(
            fetchToJson,
            "informasjon/utslagskriterier/sosialhjelp",
            true
        );

        // Hvis tilgangApiRespone ikke thrower unauthorized error, så er bruker autentisert

        const miljoVariablerResponse: MiljovariablerResponse = yield call(fetchToJson, "informasjon/miljovariabler");
        const ledeteksterResponse: LedeteksterResponse = yield call(
            fetchToJson,
            "informasjon/tekster?sprak=nb_NO&type=soknadsosialhjelp"
        );
        const fornavnResponse: FornavnResponse = yield call(fetchToJson, "informasjon/fornavn");
        const nedetidResponse: NedetidResponse = yield call(fetchToJson, "nedetid");

        yield put(lagreLedeteksterPaStore(ledeteksterResponse));
        yield put(lagreMiljovariablerPaStore(miljoVariablerResponse));
        yield put(lagreRessurserPaStore(tilgangResponse, fornavnResponse));
        yield put(lagreNedetidPaStore(nedetidResponse));
        yield put(showLargeSpinner(false));
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            // Ønsker at spinneren står og går helt til redirect er utført.
            yield put(showLargeSpinner(true));
        } else {
            yield put(showFeilSide());
        }
    }
}

function* opprettSoknadSaga(action: {type: string}) {
    try {
        const response: OpprettSoknadResponse = yield call(fetchPost, "soknader/opprettSoknad", "", true);
        yield put(opprettSoknadOk(response.brukerBehandlingId));
        yield put(startSoknadOk());
        yield put(tilSteg(1, response.brukerBehandlingId));
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            return;
        } else if (reason.message === HttpStatus.SERVICE_UNAVAILABLE) {
            yield put(loggAdvarsel("opprettSoknadSaga ServiceUnavailable: " + reason));
            yield put(visNedetidPanel(true));
            yield put(startSoknadServiceUnavailable());
        } else {
            yield put(loggAdvarsel("opprett soknad saga feilet: " + reason));
            yield put(showServerFeil(true));
            yield put(opprettSoknadFeilet());
        }
    }
}

function* hentSamtykker(action: HentSamtykker) {
    try {
        const response: Samtykke[] = yield call(fetchToJson, `soknader/${action.behandlingsId}/hentSamtykker`);
        yield put(hentSamtykkerOk(response));
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            return;
        }
        yield put(loggAdvarsel("hent samtykker saga feilet: " + reason));
        yield put(showSideIkkeFunnet(true));
    }
}

function* oppdaterSamtykke(action: {
    type: string;
    behandlingsId: string;
    harSamtykket: boolean;
    samtykker: Samtykke[];
}) {
    try {
        if (action.behandlingsId && action.harSamtykket) {
            yield call(
                fetchPost,
                soknadsdataUrl(action.behandlingsId, SoknadsSti.OPPDATER_SAMTYKKE),
                JSON.stringify(action.samtykker),
                true
            );
        }
        yield put(tilSteg(1, action.behandlingsId));
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            return;
        } else if (reason.message === HttpStatus.SERVICE_UNAVAILABLE) {
            yield put(loggAdvarsel("oppdater samtykke saga ServiceUnavailable: " + reason));
            yield put(visNedetidPanel(true));
            yield put(startSoknadServiceUnavailable());
        } else {
            yield put(loggAdvarsel("oppdater samtykke saga feilet: " + reason));
            yield put(showServerFeil(true));
        }
    }
}

function* hentSoknadSaga(action: HentSoknadAction) {
    try {
        const xsrfCookieIsOk: boolean = yield call(fetchToJson, `soknader/${action.behandlingsId}/xsrfCookie`);
        yield put(hentSoknadOk(xsrfCookieIsOk, action.behandlingsId));
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            return;
        }
        yield put(loggAdvarsel("hent soknad saga feilet: " + reason));
        yield put(showSideIkkeFunnet(true));
    }
}

function* slettSoknadSaga(action: SlettSoknadAction): SagaIterator {
    try {
        yield call(fetchDelete, "soknader/" + action.behandlingsId);
        yield put(slettSoknadOk());
        if (action.destinasjon === "START") {
            yield put(tilStart());
        } else {
            yield put(navigerTilDittNav());
        }
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            return;
        }
        yield put(loggAdvarsel("slett soknad saga feilet: " + reason));
        yield put(showServerFeil(true));
    }
}

function* sendSoknadSaga(action: SendSoknadAction): SagaIterator {
    try {
        //@ts-ignore
        const response: SendSoknadResponse = yield call(
            fetchPost,
            `soknader/${action.behandlingsId}/actions/send`,
            JSON.stringify({behandlingsId: action.behandlingsId}),
            true
        );

        lastNedForsendelseSomZipFilHvisMockMiljoEllerDev(action.behandlingsId);

        yield put(sendSoknadOk(action.behandlingsId));
        if (response && response.sendtTil === SendtTilSystemEnum.FIKS_DIGISOS_API) {
            window.location.href = getInnsynUrl() + response.id + "/status";
        } else if (response && response.id) {
            yield put(navigerTilKvittering(response.id));
        } else {
            yield put(navigerTilKvittering(action.behandlingsId));
        }
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            return;
        } else if (reason.message === HttpStatus.SERVICE_UNAVAILABLE) {
            yield put(visMidlertidigDeaktivertPanel(true));
            yield put(setSendSoknadServiceUnavailable());
        } else {
            yield put(loggAdvarsel("send soknad saga feilet: " + reason));
            yield put(showSendingFeiletPanel(true));
        }
    }
}

function* finnOgOppdaterSoknadsmottakerStatusSaga(action: FinnOgOppdaterSoknadsmottakerStatus) {
    const {brukerbehandlingId} = action;

    try {
        const navenheter: NavEnhet[] = yield call(
            fetchToJson,
            `soknader/${brukerbehandlingId}/${SoknadsSti.NAV_ENHETER}`
        );
        const valgtSoknadsmottaker: NavEnhet | undefined = navenheter.find((n: NavEnhet) => n.valgt);
        if (!valgtSoknadsmottaker || valgtSoknadsmottaker.isMottakMidlertidigDeaktivert) {
            yield put(
                loggAdvarsel(
                    "Søknadsmottaker ikke gyldig på side 9, redirecter tilbake til side 1. Søknadsmottaker var " +
                        valgtSoknadsmottaker
                )
            );
            yield put(push(`/skjema/${brukerbehandlingId}/1`));
        } else {
            yield put(oppdaterSoknadsmottakerStatus(valgtSoknadsmottaker));
        }
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            return;
        }
        yield put(
            loggAdvarsel(
                "feil i finnOgOppdaterSoknadsmottakerStatusSaga på side 9. Sender brukeren tilbake til steg 1 og håper dette ikke blir en infinite loop. Error message: " +
                    reason
            )
        );
        yield put(push(`/skjema/${brukerbehandlingId}/1`));
    }
}

function* getErSystemdataEndretSaga(action: GetErSystemdataEndret) {
    try {
        const urlPath = `soknader/${action.behandlingsId}/erSystemdataEndret`;
        const response = yield fetchToJson(urlPath, true);
        if (response) {
            yield put(loggInfo("Systemdata var endret for brukeren."));
        }
        yield put(setErSystemdataEndret(response));
    } catch (reason) {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            return;
        }
        yield put(setErSystemdataEndret(false));
        yield put(loggAdvarsel("getErSystemdataEndretSaga feilet: " + reason));
    }
}

function* soknadSaga(): SagaIterator {
    yield takeEvery(
        SoknadActionTypeKeys.SJEKK_AUTENTISERING_OG_TILGANG_OG_HENT_RESSURSER,
        sjekkAutentiseringOgTilgangOgHentRessurserSaga
    );
    yield takeEvery(SoknadActionTypeKeys.OPPRETT_SOKNAD, opprettSoknadSaga);
    yield takeEvery(SoknadActionTypeKeys.HENT_SOKNAD, hentSoknadSaga);
    yield takeEvery(SoknadActionTypeKeys.HENT_SAMTYKKE, hentSamtykker);
    yield takeEvery(SoknadActionTypeKeys.OPPDATER_SAMTYKKE, oppdaterSamtykke);

    yield takeEvery(SoknadActionTypeKeys.SLETT_SOKNAD, slettSoknadSaga);
    yield takeEvery(SoknadActionTypeKeys.SEND_SOKNAD, sendSoknadSaga);
    yield takeEvery(
        SoknadActionTypeKeys.FINN_OG_OPPDATER_SOKNADSMOTTAKER_STATUS,
        finnOgOppdaterSoknadsmottakerStatusSaga
    );
    yield takeEvery(SoknadActionTypeKeys.GET_ER_SYSTEMDATA_ENDRET, getErSystemdataEndretSaga);
}

export default soknadSaga;
