export enum SkjemaStegType {
	"skjema" = "skjema",
	"ekstrainfo" = "ekstrainfo",
	"oppsummering" = "oppsummering"
}

export interface SkjemaSteg {
	key: string;
	stegnummer: number;
	type: SkjemaStegType;
}

export interface SkjemaConfig {
	steg: SkjemaSteg[];
	tittelId: string;
	skjemanavn: string;
}