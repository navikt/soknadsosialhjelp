import * as React from "react";
import { Container, Row, Column } from "nav-frontend-grid";
import FaktumInput from "../../../skjema/faktum/FaktumInput";
import FaktumSkjemagruppe from "../../../skjema/faktum/FaktumSkjemagruppe";
import Progresjonsblokk from "../../../skjema/components/progresjonsblokk";
import {} from "../../../skjema/types";
import { FaktumComponentProps } from "../../../skjema/reducer";

const Arbeidsledig: React.StatelessComponent<FaktumComponentProps> = props => {
	return (
		<Progresjonsblokk tittel="Arbeid og utdanning">
			<FaktumSkjemagruppe tittelId="ekstrainfo.arbeidsledig.tittel">
				<Container fluid={true} className="container--noPadding">
					<Row>
						<Column sm="6" xs="3">
							<FaktumInput faktumKey="ekstrainfo.arbeidsledig.feriepenger" />
						</Column>
						<Column sm="6" xs="3">
							<FaktumInput faktumKey="ekstrainfo.arbeidsledig.sluttoppgjor" />
						</Column>
					</Row>
				</Container>
			</FaktumSkjemagruppe>
			<FaktumSkjemagruppe tittelId="ekstrainfo.jobb.tittel">
				<Container fluid={true} className="container--noPadding">
					<Row>
						<Column sm="6" xs="3">
							<FaktumInput faktumKey="ekstrainfo.jobb.bruttolonn" />
						</Column>
						<Column sm="6" xs="3">
							<FaktumInput faktumKey="ekstrainfo.jobb.nettolonn" />
						</Column>
					</Row>
				</Container>
			</FaktumSkjemagruppe>
			<FaktumSkjemagruppe tittelId="ekstrainfo.student.tittel">
				<Container fluid={true} className="container--noPadding">
					<Row>
						<Column sm="6" xs="3">
							<FaktumInput faktumKey="ekstrainfo.student.utbetaling" />
						</Column>
						<Column sm="6" xs="3">
							<FaktumInput faktumKey="ekstrainfo.student.totalt" />
						</Column>
					</Row>
				</Container>
			</FaktumSkjemagruppe>
		</Progresjonsblokk>
	);
};

export default Arbeidsledig;
