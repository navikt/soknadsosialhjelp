import { ValideringState } from "./valideringReducer";
import { FaktumState } from "./fakta/faktaReducer";
import { MiljovariablerApiType } from "./miljovariabler/miljovariablerTypes";
import { OppsummeringState } from "./oppsummering/oppsummeringReducer";
import { Infofaktum, Kvittering, REST_STATUS, Soknad } from "../types";
import { ApplikasjonsfeilState } from "./applikasjonsfeil/applikasjonsfeilReducer";
import { TilgangState } from "./tilgang/tilgangTypes";
import { LedetekstState } from "./ledetekster/ledeteksterTypes";
import { AVBRYT_DESTINASJON } from "./soknad/soknadActionTypes";
import { InitState } from "./init/initTypes";
import { FeatureTogglesApiType } from "./featuretoggles/featureTogglesTypes";
import { VedleggState } from "./vedlegg/vedleggTypes";
import { EttersendelseState } from "./ettersendelse/ettersendelseTypes";
import { OppholdsAdresseState } from "../../digisos/skjema/personopplysninger/tps/oppholdsadresseReducer";
import {
	AdresseAutocompleteState
} from "../components/adresseAutocomplete/adresseAutocompleteReducer";
import {MockState} from "../../digisos/mock/mockReducer";
import { Soknadsdata } from "./soknadsdata/soknadsdataReducer";
import {OkonomiskeOpplysningerModel} from "./okonomiskeOpplysninger/okonomiskeOpplysningerTypes";
import {FilState} from "./fil/filTypes";

export * from "./fakta/faktaActionTypes";
export * from "./valideringActionTypes";

export type Dispatch = (action: any) => Promise<any>;
export type SoknadDispatch<AT> = (action: AT) => void;
export type Reducer<S, AT> = (state: S, action: AT) => S;

export interface DispatchProps {
	dispatch: Dispatch;
}

export interface SoknadAppState {
	soknad: SoknadState;
	fakta: FaktumState;
	validering: ValideringState;
	oppsummering: OppsummeringState;
	applikasjonsfeil: ApplikasjonsfeilState;
	miljovariabler: MiljovariablerApiType;
	featuretoggles: FeatureTogglesApiType;
	tilgang: TilgangState;
	vedlegg: VedleggState;
	ledetekster: LedetekstState;
	ettersendelse: EttersendelseState;
	oppholdsadresse: OppholdsAdresseState;
	adresseAutocomplete: AdresseAutocompleteState;
	soknadsdata: Soknadsdata;
	init: InitState;
	mockData: MockState;
	okonomiskeOpplysninger: OkonomiskeOpplysningerModel;
    filopplasting: FilState
}

export interface SoknadState {
	restStatus: REST_STATUS;
	data: Soknad;
	/** Faktum som lagrer informasjon presentert på infosiden */
	infofaktum?: Infofaktum;
	kvittering?: Kvittering;
	sendSoknadPending: boolean;
	startSoknadPending: boolean;
	avbrytSoknadSjekkAktiv: boolean;
	avbrytDialog: {
		synlig: boolean;
		destinasjon: AVBRYT_DESTINASJON;
	};
	gjenopptattSoknad: boolean;
}
