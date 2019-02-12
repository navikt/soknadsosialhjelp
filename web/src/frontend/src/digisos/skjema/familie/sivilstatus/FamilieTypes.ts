export const SIVILSTATUS_STI = "familie/sivilstatus";

export enum Status {
	GIFT = "gift",
	UGIFT = "ugift",
	SAMBOER = "samboer",
	ENKE = "enke",
	SKILT = "skilt",
	SEPARERT = "separert"
}

export interface Navn {
	fornavn: string;
	mellomnavn?: string;
	etternavn: string;
	fulltNavn?: string;
}

export interface Person {
	navn: Navn;
	fodselsdato: null | string;
	personIdentifikator: string;
}

export interface Sivilstatus {
	kildeErSystem: boolean;
	sivilstatus: Status;
	ektefelle?: Person;
	ektefelleHarDiskresjonskode?: boolean;
	folkeregistrertMedEktefelle?: boolean;
	borSammenMed?: boolean;
}

export interface Familie {
	sivilstatus: Sivilstatus
}

const initialSivilstatusState: Sivilstatus = {
	kildeErSystem: false,
	sivilstatus: Status.UGIFT
};

export const initialFamilieStatus = {
	sivilstatus: initialSivilstatusState
};

export const initialPerson: Person = {
	navn: {
		fornavn: "",
		mellomnavn: "",
		etternavn: "",
		fulltNavn: null
	},
	fodselsdato: null,
	personIdentifikator: null
};