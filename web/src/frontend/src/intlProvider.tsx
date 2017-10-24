import * as React from "react";
import { addLocaleData, IntlProvider as Provider } from "react-intl";
import * as nb from "react-intl/locale-data/nb";
import NavFrontendSpinner from "nav-frontend-spinner";
import { connect } from "react-redux";
import {
	ActionTypeKeys,
	LedetekstState
} from "./nav-soknad/redux/ledetekster/ledeteksterTypes";
import { DispatchProps } from "./nav-soknad/redux/reduxTypes";
import Feilside from "./nav-soknad/components/feilside/Feilside";
import { hentMiljovariabler } from "./digisos/redux/informasjon/miljovariablerActions";
import { hentTekster } from "./nav-soknad/redux/ledetekster/ledeteksterActions";

addLocaleData(nb);

interface IntlProviderProps {
	children: React.ReactNode;
}

class IntlProvider extends React.Component<
	IntlProviderProps & DispatchProps & LedetekstState
> {
	componentDidMount() {
		this.props.dispatch(hentTekster());
		this.props.dispatch(hentMiljovariabler());
	}

	render() {
		let { children } = this.props;
		const { ledetekster } = this.props;
		const locale = "nb";

		if (ledetekster.status === ActionTypeKeys.FEILET) {
			/** I og med tekstressurser ikke er tilgjengelig, må tekster hardkodes */
			children = (
				<Feilside tekst="Vi klarer ikke vise skjemaet til deg nå, vennligst prøv igjen senere." />
			);
		} else if (ledetekster.status !== ActionTypeKeys.OK) {
			children = (
				<div className="application-spinner">
					<NavFrontendSpinner storrelse="xxl" />
				</div>
			);
		}
		return (
			<Provider messages={ledetekster.data} defaultLocale="nb" locale={locale}>
				{children}
			</Provider>
		);
	}
}

export default connect((state: LedetekstState) => {
	return {
		ledetekster: state.ledetekster
	};
})(IntlProvider);
