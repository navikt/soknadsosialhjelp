import * as React from "react";
import { connect } from "react-redux";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { Checkbox } from "nav-frontend-skjema";
import EkspanderbartPanel from "nav-frontend-ekspanderbartpanel";

import { REST_STATUS } from "../../../nav-soknad/types";
import LoadContainer from "../../../nav-soknad/components/loadContainer/LoadContainer";
import { FaktumComponentProps } from "../../../nav-soknad/redux/fakta/faktaTypes";
import { bekreftOppsummering, hentOppsummering, } from "../../../nav-soknad/redux/oppsummering/oppsummeringActions";
import { Oppsummering } from "../../../nav-soknad/redux/oppsummering/oppsummeringTypes";

import DigisosSkjemaSteg, { DigisosSteg } from "../DigisosSkjemaSteg";
import { State } from "../../redux/reducers";
import { DispatchProps } from "../../../nav-soknad/redux/reduxTypes";
import { settInfofaktum } from "../../../nav-soknad/redux/soknad/soknadActions";
import { getIntlTextOrKey } from "../../../nav-soknad/utils/intlUtils";
import { Link } from "react-router-dom";
import BehandlingAvPersonopplysningerModal from "../../informasjon/BehandlingAvPersonopplysningerModal";
import { Soknadsdata } from "../../../nav-soknad/redux/soknadsdata/soknadsdataReducer";
import Adresse from "../personopplysninger/adresse/Adresse";
import { NavEnhet } from "../personopplysninger/adresse/AdresseTypes";
import SoknadsmottakerInfoPanel from "./SoknadsmottakerInfoPanel";

interface OwnProps {
	oppsummering: Oppsummering;
	bekreftet: boolean;
	visBekreftMangler: boolean;
	restStatus: REST_STATUS;
	brukerbehandlingId: number;
	soknadsdata?: null | Soknadsdata;
}

interface OwnState {
	manglerSoknadsmottaker: boolean;
	soknadsmottakerSatt: boolean;
}
type Props = FaktumComponentProps &
	DispatchProps &
	OwnProps &
	InjectedIntlProps;

class OppsummeringView extends React.Component<Props, OwnState> {

	constructor(props: Props) {
		super(props);
		this.getOppsummering = this.getOppsummering.bind(this);
		this.state = {
			manglerSoknadsmottaker: false,
			soknadsmottakerSatt: false
		}
	}

	componentDidMount() {
		this.props.dispatch(hentOppsummering());
		this.props.dispatch(
			settInfofaktum({
				faktumKey: "informasjon.tekster",
				properties: {
					"1": getIntlTextOrKey(this.props.intl, "informasjon.start.tittel"),
					"2": getIntlTextOrKey(this.props.intl, "informasjon.start.tekst"),
					"3": getIntlTextOrKey(
						this.props.intl,
						"informasjon.nodsituasjon.undertittel"
					),
					"4": getIntlTextOrKey(
						this.props.intl,
						"informasjon.nodsituasjon.tekst"
					)
				}
			})
		);

		const {soknadsdata} = this.props;
		const navEnheter = soknadsdata.personalia.navEnheter;
		const valg = soknadsdata.personalia.adresser.valg;
		const manglerSoknadsmottaker = (valg === null || navEnheter.find((navEnhet: NavEnhet) => navEnhet.valgt) === null);
		if (manglerSoknadsmottaker === true) {
			this.setState({manglerSoknadsmottaker: true});
		} else {
			this.setState({soknadsmottakerSatt: true});
		}
	}

	componentDidUpdate(prevProps: any) {
		const {soknadsdata} = this.props;
		const navEnheter = soknadsdata.personalia.navEnheter;
		const valgtNavEnhet = navEnheter.find((navEnhet: NavEnhet) => navEnhet.valgt);
		console.warn("valgtNavEnhet: " + JSON.stringify(valgtNavEnhet, null, 4));
		if (this.state.manglerSoknadsmottaker === true && this.state.soknadsmottakerSatt === false && valgtNavEnhet) {
			this.setState({soknadsmottakerSatt: true});
		}
	}

	getOppsummering() {
		return {
			__html: this.props.oppsummering || ""
		};
	}

	render() {
		const {oppsummering, brukerbehandlingId, intl} = this.props;
		const {manglerSoknadsmottaker} = this.state;
		console.warn("this.state.manglerSoknadsmottaker: " + JSON.stringify(manglerSoknadsmottaker, null, 4));

		const bolker = oppsummering
			? this.props.oppsummering.bolker.map((bolk, idx) => (
				<div className="blokk-xs bolk" key={idx}>
					<EkspanderbartPanel tittel={bolk.tittel} apen={false}>
						<div>
							<div className="bolk__rediger">
								<Link
									className="lenke"
									to={`/skjema/${brukerbehandlingId}/${idx + 1}`}
								>
									{getIntlTextOrKey(
										this.props.intl,
										"oppsummering.gatilbake"
									)}
								</Link>
							</div>
							<div dangerouslySetInnerHTML={{__html: bolk.html}}/>
						</div>
					</EkspanderbartPanel>
				</div>
			))
			: null;

		const skjemaOppsummering = oppsummering ? (
			<div className="skjema-oppsummering">{bolker}</div>
		) : null;

		const bekreftOpplysninger: string = intl.formatMessage({
			id: "soknadsosialhjelp.oppsummering.harLestSamtykker"
		});

		let classNames = "ekspanderbartPanel skjema-oppsummering__bekreft";
		if (this.props.visBekreftMangler) {
			classNames += " skjema-oppsummering__bekreft___feil";
		}
		return (
			<LoadContainer restStatus={this.props.restStatus}>
				<DigisosSkjemaSteg steg={DigisosSteg.oppsummering} 	gaVidereDisabled={this.state.soknadsmottakerSatt === false}>
					{manglerSoknadsmottaker && (<Adresse/>)}
					<div>
						{skjemaOppsummering}
					</div>
					<div className="infopanel-oppsummering skjema-sporsmal">
						<SoknadsmottakerInfoPanel/>
					</div>
					<div className="bekreftOpplysningerPanel blokk-xs bolk">
						<div className={classNames + " bekreftCheckboksPanel-innhold " +
							(this.props.bekreftet ? " bekreftOpplysningerPanel__checked " : " ")}
						>
							<p style={{marginTop: "0"}}>
								<FormattedMessage id="soknadsosialhjelp.oppsummering.bekreftOpplysninger"/>
							</p>

							<Checkbox
								id="bekreft_oppsummering_checkbox"
								label={bekreftOpplysninger}
								checked={this.props.bekreftet}
								feil={
									this.props.visBekreftMangler
										? {
											feilmelding: intl.formatHTMLMessage({
												id: "oppsummering.feilmelding.bekreftmangler"
											})
										}
										: null
								}
								onChange={() => this.props.dispatch(bekreftOppsummering())}
							/>
						</div>
					</div>
					<BehandlingAvPersonopplysningerModal/>
				</DigisosSkjemaSteg>
			</LoadContainer>
		);
	}

}

export default connect((state: State, props: any) => {
	return {
		oppsummering: state.oppsummering.oppsummering,
		bekreftet: state.oppsummering.bekreftet,
		visBekreftMangler: state.oppsummering.visBekreftMangler,
		restStatus: state.oppsummering.restStatus,
		brukerbehandlingId: state.soknad.data.brukerBehandlingId,
		soknadsdata: JSON.parse(JSON.stringify(state.soknadsdata))
	};
})(injectIntl(OppsummeringView));
