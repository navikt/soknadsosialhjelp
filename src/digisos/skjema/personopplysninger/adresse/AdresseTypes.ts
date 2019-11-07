export interface AdressesokTreff {
	"adresse": null | string;
	"husnummer": null | string;
	"husbokstav": null | string;
	"kommunenummer": null | string;
	"kommunenavn": null | string;
	"postnummer": null | string;
	"poststed": null | string;
	"geografiskTilknytning": null | string;
	"gatekode": null | string;
	"bydel": null | string;
	"type": null | string;
}

export interface NavEnhet {
	orgnr: string;
	enhetsnr: string;
	isMottakMidlertidigDeaktivert: boolean;
	enhetsnavn: string;
	kommunenavn: string;
	kommuneNr: string;
	valgt: boolean
}

export enum AdresseKategori {
	FOLKEREGISTRERT = "folkeregistrert",
	MIDLERTIDIG = "midlertidig",
	SOKNAD = "soknad"
}

export enum AdresseType {
	GATEADRESSE = "gateadresse",
	MATRIKKELADRESSE = "matrikkeladresse",
	USTRUKTURERT = "ustrukturert"
}

export interface Matrikkeladresse {
	kommunenummer: string;
	gaardsnummer: string;
	bruksnummer: string;
	festenummer: string;
	seksjonsnummer: string;
	undernummer: string;
}

export interface Gateadresse {
	landkode: null;
	kommunenummer: string;
	adresselinjer: string[];
	bolignummer: string;
	postnummer: string;
	poststed: string;
	gatenavn: string;
	husnummer: string;
	husbokstav: string;
}

export interface UstrukturertAdresse {
	type: AdresseType.USTRUKTURERT;
	adresse: string[];
}

export interface AdresseElement {
	type: AdresseType;
	gateadresse: null | Gateadresse;
	matrikkeladresse: null | Matrikkeladresse;
	ustrukturert: null | UstrukturertAdresse;
}

export interface Adresser {
	valg: AdresseKategori | null;
	folkeregistrert: AdresseElement;
	midlertidig: AdresseElement | null;
	soknad: null | AdresseElement;
}

export const initialAdresserState: Adresser = {
	valg: null,
	folkeregistrert: {
		type: AdresseType.GATEADRESSE,
		gateadresse: {
			landkode: null,
			kommunenummer: "",
			adresselinjer: [],
			bolignummer: "",
			postnummer: "",
			poststed: "",
			gatenavn: "",
			husnummer: "",
			husbokstav: ""
		},
		matrikkeladresse: null,
		ustrukturert: null
	},
	midlertidig: null,
	soknad: null
};

export enum SoknadsMottakerStatus {
	IKKE_VALGT = "ikke_valgt",
	VALGT = "valgt",
	GYLDIG = "gyldig",
	UGYLDIG = "ugyldig",
	ER_PAKOBLET_MEN_HAR_MIDLERTIDIG_FEIL = "mangler_nav_kontor"
}