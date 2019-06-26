import * as React from "react";
import {
    Route,
    RouterProps,
    Switch,
    withRouter,
    matchPath
} from "react-router";
import {Location} from "history";
import {connect} from "react-redux";

import Steg1 from "./personopplysninger";
import Steg2 from "./begrunnelse";
import Steg3 from "./arbeidUtdanning";
import Steg4 from "./familie";
import Steg5 from "./bosituasjon";
import Steg6 from "./inntektFormue";
import Steg7 from "./utgifterGjeld";
import Steg8 from "./okonomiskeOpplysninger";
import Oppsummering from "./oppsummering";
import SideIkkeFunnet from "../../nav-soknad/containers/SideIkkeFunnet";
import {Faktum} from "../../nav-soknad/types";
import {DispatchProps} from "../../nav-soknad/redux/reduxTypes";
import {State} from "../redux/reducers";
import {skjulToppMeny} from "../../nav-soknad/utils/domUtils";
import {hentSoknad} from "../../nav-soknad/redux/soknad/soknadActions";
import NavFrontendSpinner from "nav-frontend-spinner";

interface OwnProps {
    match: any;
    location: Location;
}

interface StateProps {
    fakta: Faktum[];
    restStatus: string;
    gyldigUrl: boolean;
    steg: string;
    brukerbehandlingId: string;
    behandingsIdPaStore: string;
}

interface UrlParams {
    brukerbehandlingId: string;
    steg: string;
}

type Props = OwnProps & StateProps & RouterProps & DispatchProps;

class SkjemaRouter extends React.Component<Props, {}> {

    componentWillMount() {
        if (this.props.brukerbehandlingId && this.props.fakta.length <= 1) {
            this.props.dispatch(hentSoknad(this.props.brukerbehandlingId));
        }
    }

    componentDidMount() {
        skjulToppMeny();
    }

    render() {

        const { behandingsIdPaStore } = this.props;

        if (behandingsIdPaStore && behandingsIdPaStore !== ""){
            const {gyldigUrl} = this.props;

            if (!gyldigUrl) {
                return <SideIkkeFunnet/>;
            }
            const path = "/skjema/:brukerBehandlingId";
            return (
                <Switch>
                    <Route path={`${path}/1`} component={Steg1}/>
                    <Route path={`${path}/2`} component={Steg2}/>
                    <Route path={`${path}/3`} component={Steg3}/>
                    <Route path={`${path}/4`} component={Steg4}/>
                    <Route path={`${path}/5`} component={Steg5}/>
                    <Route path={`${path}/6`} component={Steg6}/>
                    <Route path={`${path}/7`} component={Steg7}/>
                    <Route path={`${path}/8`} component={Steg8}/>
                    <Route path={`${path}/9`} component={Oppsummering}/>
                    <Route component={SideIkkeFunnet}/>
                </Switch>
            );
        }

        return (
            <div className="application-spinner">
                <NavFrontendSpinner type="XXL" />
            </div>
        )

    }
}

const mapStateToProps = (
    state: State,
    props: OwnProps & RouterProps
): StateProps => {
    const match = matchPath(props.location.pathname, {
        path: "/skjema/:brukerbehandlingId/:steg"
    });
    const {steg, brukerbehandlingId} = match.params as UrlParams;
    return {
        fakta: state.fakta.data,
        restStatus: state.soknad.restStatus,
        steg,
        brukerbehandlingId,
        gyldigUrl: brukerbehandlingId !== undefined && steg !== undefined,
        behandingsIdPaStore: state.soknad.behandlingsId
    };
};

export default connect(mapStateToProps)(withRouter(SkjemaRouter) as any);
