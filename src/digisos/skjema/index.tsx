import * as React from "react";
import {
    Route,
    RouterProps,
    Switch,
    withRouter,
    matchPath, Prompt
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
import {DispatchProps} from "../../nav-soknad/redux/reduxTypes";
import {State} from "../redux/reducers";
import {skjulToppMeny} from "../../nav-soknad/utils/domUtils";
import {hentSoknad} from "../../nav-soknad/redux/soknad/soknadActions";
import NavFrontendSpinner from "nav-frontend-spinner";
import {erSkjemaEllerEttersendelseSide, NAVIGASJONSPROMT} from "../../nav-soknad/utils";
import TimeoutBox from "../../nav-soknad/components/timeoutbox/TimeoutBox";
import AvbrytSoknad from "../../nav-soknad/components/avbrytsoknad/AvbrytSoknad";

interface OwnProps {
    match: any;
    location: Location;
}

interface StateProps {
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
        if (this.props.brukerbehandlingId) {
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
                <>
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
                    <Prompt
                        message={loc =>
                            erSkjemaEllerEttersendelseSide(loc.pathname)
                                ? true
                                : NAVIGASJONSPROMT.SKJEMA
                        }
                    />
                    <TimeoutBox
                        sessionDurationInMinutes={30}
                        showWarningerAfterMinutes={25}
                    />
                    <AvbrytSoknad/>
                </>
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
    if (match){
        const {steg, brukerbehandlingId} = match.params as UrlParams;
        return {
            restStatus: state.soknad.restStatus,
            steg,
            brukerbehandlingId,
            gyldigUrl: brukerbehandlingId !== undefined && steg !== undefined,
            behandingsIdPaStore: state.soknad.behandlingsId
        };
    } else {
        return {
            restStatus: state.soknad.restStatus,
            steg: "1",
            brukerbehandlingId: "42",
            gyldigUrl: false,
            behandingsIdPaStore: state.soknad.behandlingsId
        };
    }
};

export default connect(mapStateToProps)(withRouter(SkjemaRouter) as any);