import * as React from "react";
import {
	connectSoknadsdataContainer,
	SoknadsdataContainerProps
} from "../../../../nav-soknad/redux/soknadsdata/soknadsdataContainerUtils";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { SoknadsSti } from "../../../../nav-soknad/redux/soknadsdata/soknadsdataReducer";
import { Sivilstatus, Status } from "./FamilieTypes";
import SivilstatusComponent from "./SivilstatusComponent";
import EktefelleDetaljer from "./EktefelleDetaljer";
import Sporsmal from "../../../../nav-soknad/components/sporsmal/Sporsmal";
import TextPlaceholder from "../../../../nav-soknad/components/animasjoner/placeholder/TextPlaceholder";
import { REST_STATUS } from "../../../../nav-soknad/types";

type Props = SoknadsdataContainerProps & InjectedIntlProps;

interface State {
	pending: boolean;
}

class DinSivilstatusView extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			pending: true
		};
	}

	componentDidMount() {
		this.props.hentSoknadsdata(this.props.brukerBehandlingId, SoknadsSti.SIVILSTATUS);
	}

	componentWillUpdate() {
		const { soknadsdata } = this.props;
		const restStatus = soknadsdata.restStatus.familie.sivilstatus;
		if (this.state.pending && restStatus === REST_STATUS.OK) {
			this.setState({ pending: false });
		}
	}

	render() {
		const { soknadsdata } = this.props;
		const sivilstatus: Sivilstatus = soknadsdata.familie.sivilstatus;
		if (this.state.pending) {
			return (
				<div className="skjema-sporsmal">
					<Sporsmal sprakNokkel="familie.sivilstatus">
						<TextPlaceholder lines={6}/>
					</Sporsmal>
				</div>
			)
		}
		if (sivilstatus && sivilstatus.sivilstatus === Status.GIFT && sivilstatus.kildeErSystem === true) {
			return <EktefelleDetaljer/>
		} else {
			return (<SivilstatusComponent/>);
		}
	}
}

export default connectSoknadsdataContainer(injectIntl(DinSivilstatusView));