import { Person, Sivilstatus  } from "./FamilieTypes";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import * as React from "react";
import { State } from "../../../redux/reducers";
import { connect } from "react-redux";
import Sporsmal from "../../../../nav-soknad/components/sporsmal/Sporsmal";
import { formaterIsoDato, getFaktumSporsmalTekst } from "../../../../nav-soknad/utils";
import Detaljeliste, { DetaljelisteElement } from "../../../../nav-soknad/components/detaljeliste";
import { DigisosFarge } from "../../../../nav-soknad/components/svg/DigisosFarger";
import Informasjonspanel, { InformasjonspanelIkon } from "../../../../nav-soknad/components/informasjonspanel";

interface OwnProps {
	brukerBehandlingId?: string;
	sivilstatus?: Sivilstatus;
	hentSivilstatus?: (brukerBehandlingId: string) => void;
}

type Props = OwnProps & InjectedIntlProps;

class EktefelleDetaljer extends React.Component<Props, {}> {

	// componentDidMount() {
	// 	this.props.hentSivilstatus(this.props.brukerBehandlingId);
	// }

	renderSivilstatusLabel(ektefelleHarDiskresjonskode: boolean): any {
		let formattedMessageId: string = "system.familie.sivilstatus.label";
		if (ektefelleHarDiskresjonskode && ektefelleHarDiskresjonskode === true) {
			formattedMessageId = "system.familie.sivilstatus.ikkeTilgang.label";
		}
		return <FormattedMessage id={formattedMessageId}/>
	}

	renderEktefelleInformasjon() {
		const { sivilstatus } = this.props;
		const ektefelle: Person = sivilstatus.ektefelle;
		const INTL_ID_EKTEFELLE = "system.familie.sivilstatus.gift.ektefelle";
		return (
			<div className="sivilstatus__ektefelleinfo">
				{ektefelle && ektefelle.navn && ektefelle.navn.fulltNavn && (
					<Detaljeliste>
						<DetaljelisteElement
							tittel={<FormattedMessage id={INTL_ID_EKTEFELLE + ".navn"}/>}
							verdi={ektefelle.navn.fulltNavn}
						/>
						<DetaljelisteElement
							tittel={<FormattedMessage id={INTL_ID_EKTEFELLE + ".fodselsdato"}/>}
							verdi={formaterIsoDato(ektefelle.fodselsdato)}
						/>
						<DetaljelisteElement
							tittel={
								<FormattedMessage id={INTL_ID_EKTEFELLE + ".folkereg"}/>
							}
							verdi={
								(sivilstatus.folkeregistrertMedEktefelle === true ?
										<FormattedMessage
											id={INTL_ID_EKTEFELLE + ".folkeregistrertsammen.true"}/> :
										<FormattedMessage
											id={INTL_ID_EKTEFELLE + ".folkeregistrertsammen.false"}/>
								)
							}
						/>
					</Detaljeliste>
				)}
			</div>
		);
	}

	render() {
		const { intl, sivilstatus } = this.props;
		const ektefelleHarDiskresjonskode: boolean = sivilstatus.ektefelleHarDiskresjonskode;

		return (
			<div style={{ border: "3px dotted red", display: "block" }}>
				<div className="sivilstatus skjema-sporsmal">
					<Sporsmal
						tekster={getFaktumSporsmalTekst(intl, "system.familie.sivilstatus")}
						style="system"
					>
						<div className="sivilstatus__infotekst">
							<FormattedMessage id="system.familie.sivilstatus"/>
						</div>
						<div className="sivilstatus__giftlabel">
							{this.renderSivilstatusLabel(ektefelleHarDiskresjonskode)}
							{this.renderEktefelleInformasjon()}
						</div>
					</Sporsmal>
					{ektefelleHarDiskresjonskode !== true && (
						<Informasjonspanel
							farge={DigisosFarge.VIKTIG}
							ikon={InformasjonspanelIkon.ELLA}
						>
							<h4 className="skjema-sporsmal__infotekst__tittel">
								<FormattedMessage id="system.familie.sivilstatus.informasjonspanel.tittel"/>
							</h4>
							<FormattedMessage id="system.familie.sivilstatus.informasjonspanel.tekst"/>
						</Informasjonspanel>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: State) => ({
	brukerBehandlingId: state.soknad.data.brukerBehandlingId,
	feil: state.validering.feil,
	sivilstatus: state.soknadsdata.familie.sivilstatus
});

// const mapDispatchToProps = (dispatch: any) => ({
// 	hentSivilstatus: (brukerBehandlingId: string) => {
// 		dispatch(fetchSoknadsdataAction(brukerBehandlingId, SIVILSTATUS_STI));
// 	}
// });

export default connect<{}, {}, OwnProps>(
	mapStateToProps
)(injectIntl(EktefelleDetaljer));