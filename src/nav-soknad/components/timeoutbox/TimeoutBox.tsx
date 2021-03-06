import * as React from "react";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import NavFrontendModal from "nav-frontend-modal";

import Nedtelling from "./Nedtelling";
import LoggetUt from "./LoggetUt";
import {IntlProps, now} from "../../utils";
import {REST_STATUS} from "../../../digisos/redux/soknad/soknadTypes";

interface State {
    utloggingsTidspunkt: number;
    visAdvarselTidspunkt: number;
    visAdvarsel: boolean;
    visLoggetUt: boolean;
    timeoutTimer: any;
}

interface OwnProps {
    sessionDurationInMinutes: number;
    showWarningerAfterMinutes: number;
    restStatus: string;
}

type Props = OwnProps & IntlProps;

class TimeoutBox extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            utloggingsTidspunkt: this.beregnUtloggingsTidspunkt(),
            visAdvarselTidspunkt: this.beregnVisAdvarseTidspunkt(),
            visAdvarsel: false,
            visLoggetUt: false,
            timeoutTimer: null,
        };
    }

    componentWillMount() {
        const millisekunderMellomSjekk = 60 * 1000;
        const timeoutTimer = setInterval(() => {
            const tidIgjenAvSesjon = this.state.utloggingsTidspunkt - now();
            const tidIgjenForAdvarsel = this.state.visAdvarselTidspunkt - now();
            const visAdvarsel = tidIgjenForAdvarsel < 0 && tidIgjenAvSesjon > 0;
            const visLoggetUt = tidIgjenAvSesjon < 0;
            this.setState({visAdvarsel, visLoggetUt});
        }, millisekunderMellomSjekk);
        this.setState({timeoutTimer});
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.restStatus === REST_STATUS.PENDING && this.props.restStatus === REST_STATUS.OK) {
            this.setState({
                utloggingsTidspunkt: this.beregnUtloggingsTidspunkt(),
                visAdvarselTidspunkt: this.beregnVisAdvarseTidspunkt(),
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.timeoutTimer);
    }

    beregnUtloggingsTidspunkt(): number {
        const millisekunderTilUtlogging = this.props.sessionDurationInMinutes * 60 * 1000;
        return now() + millisekunderTilUtlogging;
    }

    beregnVisAdvarseTidspunkt(): number {
        const millisekunderTilAdvarsel = this.props.showWarningerAfterMinutes * 60 * 1000;
        return now() + millisekunderTilAdvarsel;
    }

    onLoginAgainClick() {
        window.location.reload();
    }

    onContinueClick() {
        this.setState({
            utloggingsTidspunkt: this.beregnUtloggingsTidspunkt(),
            visAdvarselTidspunkt: this.beregnVisAdvarseTidspunkt(),
            visAdvarsel: false,
            visLoggetUt: false,
        });
    }

    render() {
        const intl = this.props.intl;
        const {visAdvarsel, visLoggetUt} = this.state;
        return (
            <NavFrontendModal
                isOpen={visAdvarsel || visLoggetUt}
                contentLabel={intl.formatMessage({id: "timeout.fortsett"})}
                closeButton={false}
                onRequestClose={() => null}
            >
                <div className="timeoutbox">
                    {visAdvarsel && (
                        <Nedtelling
                            onContinueClick={() => {
                                this.onContinueClick();
                            }}
                            utloggingsUrl="/esso/logout"
                        />
                    )}
                    {visLoggetUt && (
                        <LoggetUt
                            onLoginAgainClick={() => {
                                this.onLoginAgainClick();
                            }}
                        />
                    )}
                </div>
            </NavFrontendModal>
        );
    }
}

export default connect((state: any, props: any) => {
    return {
        restStatus: state.fakta && state.fakta.restStatus ? state.fakta.restStatus : REST_STATUS.INITIALISERT,
    };
})(injectIntl(TimeoutBox));
