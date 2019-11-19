import {NavEnhet} from "../../digisos/skjema/personopplysninger/adresse/AdresseTypes";
import {Dispatch} from "../../digisos/redux/reduxTypes";
import {fetchToJson, HttpStatus} from "../utils/rest-utils";
import {soknadsdataUrl} from "../../digisos/redux/soknadsdata/soknadsdataActions";
import {SoknadsSti} from "../../digisos/redux/soknadsdata/soknadsdataReducer";
import {clearAllValideringsfeil} from "../../digisos/redux/validering/valideringActions";
import {
    showServerFeil,
    visIkkePakobletPanel,
    visMidlertidigDeaktivertPanel
} from "../../digisos/redux/soknad/soknadActions";
import {loggAdvarsel, loggFeil} from "../../digisos/redux/navlogger/navloggerActions";

export const erPaStegEnOgValgtNavEnhetErUgyldig = (stegnummer: number, valgtNavEnhet: NavEnhet | undefined): boolean => {
    return stegnummer === 1 && (!valgtNavEnhet || (valgtNavEnhet && valgtNavEnhet.isMottakMidlertidigDeaktivert) || (valgtNavEnhet && !valgtNavEnhet.enhetsnr))
};

export const valgtNavKontorErGyldig = (valgtNavKontor: NavEnhet | undefined): boolean => {
    return valgtNavKontor && !valgtNavKontor.isMottakMidlertidigDeaktivert ? true : false;
};

export const valgtNavKontorErGyldigMenMottakErMidlertidigDeaktivert = (valgtNavKontor: NavEnhet | undefined): boolean => {
    return valgtNavKontor && valgtNavKontor.isMottakMidlertidigDeaktivert ? true : false
};

export const responseIsOfTypeListAndContainsAtleastOneObject = (response: any) => {
    if(response && typeof response !== "string" && (response as NavEnhet[])[0]){
        return true;
    } else {
        return false;
    }
};

export const sjekkOmValgtNavEnhetErGyldig = (behandlingsId: string, dispatch: Dispatch, callbackHvisGyldig: () => void) => {
    fetchToJson(soknadsdataUrl(behandlingsId, SoknadsSti.NAV_ENHETER)).then((response) => {
        if (responseIsOfTypeListAndContainsAtleastOneObject(response)) {
            const valgtNavKontor: NavEnhet | undefined = (response as NavEnhet[]).find((navEnhet: NavEnhet) => {
                return navEnhet.valgt;
            });

            if (valgtNavKontorErGyldig(valgtNavKontor)) {
                dispatch(clearAllValideringsfeil());
                dispatch(visMidlertidigDeaktivertPanel(false));
                dispatch(visIkkePakobletPanel(false));
                callbackHvisGyldig();
            } else if (valgtNavKontorErGyldigMenMottakErMidlertidigDeaktivert(valgtNavKontor)) {
                dispatch(visMidlertidigDeaktivertPanel(true));
            } else {
                dispatch(visIkkePakobletPanel(true))
            }
        }

    }).catch((reason: any) => {
        if (reason.message === HttpStatus.UNAUTHORIZED) {
            dispatch(loggAdvarsel("hentSoknadsdata: " + reason));
        } else {
            dispatch(loggFeil("Henting av navEnhet feilet: " + reason));
            dispatch(showServerFeil(true));
        }
    });
};