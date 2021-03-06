import {
    InputType,
    Opplysning,
    OpplysningBackend,
    OpplysningerBackend,
    OpplysningGruppe,
    OpplysningRad,
    OpplysningSpc,
    OpplysningType,
} from "./opplysningerTypes";
import {opplysningsRekkefolgeOgSpc} from "./opplysningerConfig";
import {loggErrorToServer} from "../../../nav-soknad/utils/loggerUtils";
import {NavLogEntry, NavLogLevel} from "../navlogger/navloggerTypes";

export function getOpplysningerUrl(behandlingsId: string) {
    return `soknader/${behandlingsId}/okonomiskeOpplysninger`;
}

export const updateSortertOpplysning = (opplysninger: Opplysning[], opplysningUpdated: Opplysning) => {
    const index = opplysninger.findIndex((o) => o.type === opplysningUpdated.type);
    opplysninger[index] = opplysningUpdated;
    return opplysninger;
};

export const transformToBackendOpplysning = (opplysning: Opplysning): OpplysningBackend => {
    return {
        type: opplysning.type,
        gruppe: opplysning.gruppe ? opplysning.gruppe : OpplysningGruppe.UKJENT,
        rader: opplysning.rader,
        vedleggStatus: opplysning.vedleggStatus,
        filer: opplysning.filer,
    };
};

export const getGruppeTittelKey: (opplysningGruppe: OpplysningGruppe) => string = (
    opplysningGruppe: OpplysningGruppe
) => {
    switch (opplysningGruppe) {
        case OpplysningGruppe.STATSBORGERSKAP: {
            return "opplysninger.statsborgerskap";
        }
        case OpplysningGruppe.ARBEID: {
            return "opplysninger.arbeid";
        }
        case OpplysningGruppe.FAMILIE: {
            return "opplysninger.familiesituasjon";
        }
        case OpplysningGruppe.BOSITUASJON: {
            return "opplysninger.bosituasjon";
        }
        case OpplysningGruppe.INNTEKT: {
            return "opplysninger.inntekt";
        }
        case OpplysningGruppe.UTGIFTER: {
            return "opplysninger.utgifter";
        }
        case OpplysningGruppe.GENERELLE_VEDLEGG: {
            return "opplysninger.generell";
        }
        case OpplysningGruppe.ANDRE_UTGIFTER: {
            return "opplysninger.ekstrainfo";
        }
        case OpplysningGruppe.UKJENT: {
            return "opplysninger.ukjent";
        }
        default: {
            return "unknown group tittle";
        }
    }
};

export const getTomVedleggRad: () => OpplysningRad = () => {
    return {
        beskrivelse: "",
        belop: "",
        brutto: "",
        netto: "",
        avdrag: "",
        renter: "",
    };
};

export const getOpplysningByOpplysningType = (opplysningerSortert: Opplysning[], opplysningType: OpplysningType) => {
    return opplysningerSortert.find((o: Opplysning) => {
        return o.type && o.type === opplysningType;
    });
};

export const getSortertListeAvOpplysninger = (backendData: OpplysningerBackend): Opplysning[] => {
    const {okonomiskeOpplysninger, slettedeVedlegg} = backendData;
    const opplysningerAktive: Opplysning[] = okonomiskeOpplysninger.map((opplysningBackend: OpplysningBackend) => {
        return backendOpplysningToOpplysning(opplysningBackend, false);
    });

    const opplysningerSlettede: Opplysning[] = slettedeVedlegg.map((opplysningBackend: OpplysningBackend) => {
        return backendOpplysningToOpplysning(opplysningBackend, true);
    });
    const alleOpplysninger: Opplysning[] = opplysningerAktive.concat(opplysningerSlettede);
    const opplysningerSortert: MaybeOpplysning[] = sorterOpplysninger(alleOpplysninger, opplysningsRekkefolgeOgSpc);
    const opplysningerSortertOgNullsFiltrertBort: Opplysning[] = filterOutNullValuesFromList(opplysningerSortert);
    return opplysningerSortertOgNullsFiltrertBort;
};

const filterOutNullValuesFromList = (list: MaybeOpplysning[]): Opplysning[] => {
    const listUtenNulls: Opplysning[] = [];

    list.forEach((maybeOpplysning: MaybeOpplysning) => {
        if (maybeOpplysning) {
            listUtenNulls.push(maybeOpplysning);
        }
    });

    return listUtenNulls;
};

export const getSpcForOpplysning = (opplysningType: OpplysningType): OpplysningSpc | undefined => {
    const opplysningSpcs = opplysningsRekkefolgeOgSpc.filter((oSpc: OpplysningSpc) => {
        return oSpc.type === opplysningType;
    });

    if (opplysningSpcs && opplysningSpcs.length === 0) {
        const navLogEntry: NavLogEntry = {
            level: NavLogLevel.ERROR,
            message: `Spc ikke funnet for opplysning med type: "${opplysningType}"`,
            jsFileUrl: "opplysningerUtils.js",
        };
        loggErrorToServer(navLogEntry);
    }

    return opplysningSpcs[0];
};

const backendOpplysningToOpplysning = (opplysningBackend: OpplysningBackend, erSlettet: boolean): Opplysning => {
    const spc: OpplysningSpc | undefined = getSpcForOpplysning(opplysningBackend.type);

    let radInnhold_: InputType[] = [];
    if (spc) {
        radInnhold_ = spc.radInnhold;
    }

    return {
        type: opplysningBackend.type,
        gruppe: opplysningBackend.gruppe,
        rader: opplysningBackend.rader,
        vedleggStatus: opplysningBackend.vedleggStatus,
        filer: opplysningBackend.filer,
        slettet: erSlettet,
        radInnhold: radInnhold_,
        pendingLasterOppFil: false,
    };
};

type MaybeOpplysning = Opplysning | null;

function sorterOpplysninger(usortertListe: Opplysning[], rekkefolge: OpplysningSpc[]): MaybeOpplysning[] {
    const sortert: MaybeOpplysning[] = [];
    sortert.fill(null, 0, rekkefolge.length - 1);

    for (const opplysning of usortertListe) {
        let erPlassertISortertListe = false;
        let n = 0;
        while (erPlassertISortertListe === false) {
            if (n > rekkefolge.length - 1) {
                erPlassertISortertListe = true;

                const navLogEntry: NavLogEntry = {
                    level: NavLogLevel.ERROR,
                    message: `Ukjent okonomisk opplysning oppdaget. Okonomisk opplysning med type "${opplysning.type}" mottatt fra backend`,
                    jsFileUrl: "opplysningerUtils.js",
                };
                loggErrorToServer(navLogEntry);
            } else if (opplysning.type === rekkefolge[n].type) {
                sortert[n] = opplysning;
                erPlassertISortertListe = true;
            }
            n += 1;
        }
    }
    return sortert;
}
