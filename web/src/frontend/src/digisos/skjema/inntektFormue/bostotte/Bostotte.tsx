import * as React from "react";
import { LegendTittleStyle } from "../../../../nav-soknad/components/sporsmal/Sporsmal";
import { getFaktumSporsmalTekst } from "../../../../nav-soknad/utils";
import { FormattedHTMLMessage, InjectedIntlProps, injectIntl } from "react-intl";
import JaNeiSporsmal from "../../../../nav-soknad/faktum/JaNeiSporsmal";
import {
	connectSoknadsdataContainer,
	SoknadsdataContainerProps
} from "../../../../nav-soknad/redux/soknadsdata/soknadsdataContainerUtils";
import { SoknadsSti } from "../../../../nav-soknad/redux/soknadsdata/soknadsdataReducer";
import { Bostotte } from "./bostotteTypes";
import Informasjonspanel, { InformasjonspanelIkon } from "../../../../nav-soknad/components/informasjonspanel";
import { DigisosFarge } from "../../../../nav-soknad/components/svg/DigisosFarger";
import { REST_STATUS } from "../../../../nav-soknad/types";

const FAKTUM_BOSTOTTE = "inntekt.bostotte";

type Props = SoknadsdataContainerProps  & InjectedIntlProps;

interface State {
	pending: boolean
}

class BostotteView extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			pending: true
		}
	}

	componentDidMount() {
		const {hentSoknadsdata, brukerBehandlingId} = this.props;
		hentSoknadsdata(brukerBehandlingId, SoknadsSti.BOSTOTTE);
	}

	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
		if (this.state.pending) {
			if (this.props.soknadsdata.restStatus.inntekt.bostotte === REST_STATUS.OK) {
				this.setState({pending: false});
			}
		}
	}

	handleClickJaNeiSpsm(verdi: boolean) {
		const {brukerBehandlingId, soknadsdata} = this.props;
		const restStatus = soknadsdata.restStatus.inntekt.bostotte;
		if(restStatus === REST_STATUS.OK) {
			const bostotte: Bostotte = soknadsdata.inntekt.bostotte;
			bostotte.bekreftelse = verdi;
			this.props.oppdaterSoknadsdataSti(SoknadsSti.BOSTOTTE, bostotte);
			this.props.lagreSoknadsdata(brukerBehandlingId, SoknadsSti.BOSTOTTE, bostotte);
		}
	}

	render() {
		const {soknadsdata} = this.props;
		const bostotte : Bostotte = soknadsdata.inntekt.bostotte;
		return (
			<div className="skjema-sporsmal">
				<JaNeiSporsmal
					visPlaceholder={this.state.pending}
					tekster={getFaktumSporsmalTekst(this.props.intl, FAKTUM_BOSTOTTE)}
					faktumKey={FAKTUM_BOSTOTTE}
					verdi={bostotte.bekreftelse}
					onChange={(verdi: boolean) => this.handleClickJaNeiSpsm(verdi)}
					legendTittelStyle={LegendTittleStyle.FET_NORMAL}
				/>
				<Informasjonspanel
					synlig={bostotte.bekreftelse === false}
					ikon={InformasjonspanelIkon.ELLA}
					farge={DigisosFarge.VIKTIG}
				>
					<FormattedHTMLMessage id="informasjon.husbanken.bostotte"/>
				</Informasjonspanel>
			</div>
		);
	}
}

export default connectSoknadsdataContainer(injectIntl(BostotteView));