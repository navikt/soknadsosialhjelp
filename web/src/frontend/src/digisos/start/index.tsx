import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";

import { State } from "../redux/reducers";
import { REST_STATUS } from "../../nav-soknad/types";
import AppBanner from "../../nav-soknad/components/appHeader/AppHeader";
import { getIntlTextOrKey, scrollToTop } from "../../nav-soknad/utils";
import ServerFeil from "../../nav-soknad/containers/ServerFeil";
import { DispatchProps } from "../../nav-soknad/redux/reduxTypes";
import {
	resetSoknad,
	startSoknad
} from "../../nav-soknad/redux/soknad/soknadActions";
import { skjulToppMeny } from "../../nav-soknad/utils/domUtils";

const DocumentTitle = require("react-document-title"); // tslint:disable-line

interface StateProps {
	soknadRestStatus: string;
	faktaRestStatus: string;
	startSoknadPending: boolean;
	kommunerRestStatus: REST_STATUS;
}

type Props = StateProps & InjectedIntlProps & DispatchProps;

// TODO Fjerne denne komponenten?

class Start extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.startSoknad = this.startSoknad.bind(this);
	}

	componentDidMount() {
		skjulToppMeny();
		scrollToTop();
		this.props.dispatch(resetSoknad());
	}

	startSoknad(kommuneId: string, bydelId?: string) {
		this.props.dispatch(startSoknad(kommuneId, bydelId));
	}

	render() {
		const { intl, soknadRestStatus, faktaRestStatus } = this.props;
		const title = getIntlTextOrKey(intl, "applikasjon.sidetittel");
		if (
			soknadRestStatus === REST_STATUS.FEILET ||
			faktaRestStatus === REST_STATUS.FEILET
		) {
			return <ServerFeil />;
		}
		return (
			<DocumentTitle title={title}>
				<span>
					<AppBanner />
					<div className="skjema-content">
						<p className="blokk-l">
							{getIntlTextOrKey(intl, "personalia.informasjon")}
						</p>
					</div>
				</span>
			</DocumentTitle>
		);
	}
}

export default connect((state: State, props: any) => {
	return {
		soknadRestStatus: state.soknad.restStatus,
		startSoknadPending: state.soknad.startSoknadPending,
		faktaRestStatus: state.fakta.restStatus
	};
})(injectIntl(Start));