import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import Infoblokk from "../../../nav-soknad/components/infoblokk/index";
import { FormattedHTMLMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { SynligeFaktaProps } from "../../redux/synligefakta/synligeFaktaTypes";
import InformasjonBolk from "./InformasjonBolk";
import DigisosSkjemaSteg, { DigisosSteg } from "../DigisosSkjemaSteg";
import LoadContainer from "../../../nav-soknad/components/loadContainer/LoadContainer";
import { DispatchProps } from "../../../nav-soknad/redux/reduxTypes";
import { byggBelopOgVedleggStruktur } from "../../redux/synligefakta/synligeFaktaActions";
import { REST_STATUS } from "../../../nav-soknad/types/restTypes";
import { getIntlText, harBrukerBesvartFaktum } from "../../../nav-soknad/utils";
import { Faktum } from "../../../nav-soknad/types";

/** For å kunne sjekke om bruker har besvart noen av de
 * spørsmålene som trigger oppfølgingsspørsmål på denne side,
 * er disse hardkodet nå. Dersom det blir endringer i XML, må disse endres
 * også.
 */
const okonomiskeFaktumKeys = [
	"dinsituasjon.jobb",
	"dinsituasjon.studerer",
	"familie.barn.true.barnebidrag",
	"bosituasjon",
	"inntekt.bostotte",
	"inntekt.eierandeler.true.type.bolig",
	"inntekt.eierandeler.true.type.kjoretoy",
	"inntekt.eierandeler.true.type.campingvogn",
	"inntekt.eierandeler.true.type.fritidseiendom",
	"inntekt.eierandeler.true.type.annet",
	"inntekt.bankinnskudd.true.type.brukskonto",
	"inntekt.bankinnskudd.true.type.bsu",
	"inntekt.bankinnskudd.true.type.sparekonto",
	"inntekt.bankinnskudd.true.type.livsforsikring",
	"inntekt.bankinnskudd.true.type.aksjer",
	"inntekt.bankinnskudd.true.type.annet",
	"inntekt.inntekter.true.type.utbytte",
	"inntekt.inntekter.true.type.salg",
	"inntekt.inntekter.true.type.forsikringsutbetalinger",
	"inntekt.inntekter.true.type.annet",
	"utgifter.boutgift.true.type.husleie",
	"utgifter.boutgift.true.type.strom",
	"utgifter.boutgift.true.type.kommunaleavgifter",
	"utgifter.boutgift.true.type.oppvarming",
	"utgifter.boutgift.true.type.avdraglaan",
	"utgifter.boutgift.true.type.andreutgifter",
	"utgifter.barn.true.utgifter.fritidsaktivitet",
	"utgifter.barn.true.utgifter.barnehage",
	"utgifter.barn.true.utgifter.sfo",
	"utgifter.barn.true.utgifter.tannbehandling",
	"utgifter.barn.true.utgifter.annet"
];

const eiendelerSomIkkeTrengerVedleggsOpplasting = [
	"opplysninger.inntekt.eierandeler.bolig",
	"opplysninger.inntekt.eierandeler.kjoretoy",
	"opplysninger.inntekt.eierandeler.campingvogn",
	"opplysninger.inntekt.eierandeler.fritidseiendom",
	"opplysninger.inntekt.eierandeler.annet"
];

interface OwnProps {
	fakta: Faktum[];
}

type Props = OwnProps & SynligeFaktaProps & DispatchProps & InjectedIntlProps;

class EkstraInformasjon extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.renderIkkeBesvart = this.renderIkkeBesvart.bind(this);
		this.renderEkstrasporsmal = this.renderEkstrasporsmal.bind(this);
		this.renderInfoMelding = this.renderInfoMelding.bind(this);
	}

	componentDidMount() {
		this.props.dispatch(byggBelopOgVedleggStruktur());
	}

	renderIkkeBesvart() {
		return (
			<div className="skjema-content">
				<div className="ekstrainfo-melding">
					<Infoblokk
						brukSystemtittel={true}
						tittel={this.props.intl.formatMessage({
							id: "opplysninger.ikkebesvart.tittel"
						})}
						ikon="advarsel"
					>
						<div className="blokk-m">
							<FormattedHTMLMessage id="opplysninger.ikkebesvart.melding"/>
						</div>
					</Infoblokk>
				</div>
			</div>
		);
	}

	renderInfoMelding() {
		return (
			<div className="skjema-content">
				<div className="ekstrainfo-melding">
					<Infoblokk>
						<FormattedHTMLMessage id="opplysninger.informasjon"/>
					</Infoblokk>
				</div>
			</div>
		);
	}

	renderEkstrasporsmal() {
		const {data} = this.props.synligefakta;

		const OPPLYSNINGER_INNTEKT: string = "opplysninger.inntekt";
		const inntektListe: object[] = data[OPPLYSNINGER_INNTEKT];
		let n: number = 0;
		const ID = "id";

		for (const key in inntektListe){
			if(key){

				const inntektListeElement = inntektListe[key][ID];

				if (eiendelerSomIkkeTrengerVedleggsOpplasting.indexOf(inntektListeElement) < 0){
					n ++;
					console.warn("ADDED PÅ N");
				}
			}
		}

		return Object.keys(data).map(key => {

			console.warn("n = " + n);

			if (key !== OPPLYSNINGER_INNTEKT || n > 0){
				return (
					<InformasjonBolk
						id={key}
						key={key}
						tittel={this.props.intl.formatMessage({
							id: `${key}.sporsmal`
						})}
						beskrivelse={getIntlText(this.props.intl, `${key}.beskrivelse`)}
						faktumstrukturer={data[key]}
					/>
				)
			} else {
				return null
			}
		});

	}

	render() {
		const {data, restStatus} = this.props.synligefakta;
		let melding;
		let content;
		if (restStatus === REST_STATUS.OK) {
			const harBesvartOkonomiskeFaktum = harBrukerBesvartFaktum(
				this.props.fakta,
				okonomiskeFaktumKeys
			);
			if (!harBesvartOkonomiskeFaktum || Object.keys(data).length === 0) {
				melding = this.renderIkkeBesvart();
			} else {
				melding = this.renderInfoMelding();
			}
			content = this.renderEkstrasporsmal();
		}

		return (
			<LoadContainer restStatus={restStatus}>
				<div className="steg-ekstrainformasjon">
					<DigisosSkjemaSteg steg={DigisosSteg.opplysningerbolk}>
						{melding}
						{content}
					</DigisosSkjemaSteg>
				</div>
			</LoadContainer>
		);
	}
}

export default connect((state: State) => {
	return {
		fakta: state.fakta.data,
		synligefakta: state.synligefakta
	};
})(injectIntl(EkstraInformasjon));
