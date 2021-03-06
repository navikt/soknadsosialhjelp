import * as React from "react";
import {UnmountClosed} from "react-collapse";
import {FormattedMessage} from "react-intl";
import AvsnittMedMarger from "./avsnittMedMarger";
import {MargIkoner} from "./margIkoner";
import EttersendelseVedleggListe from "./ettersendelseVedleggListe";

interface Props {
    children: React.ReactNode;
    ettersendelseAktivert: boolean;
    onEttersendelse?: () => void;
    kunGenerellDokumentasjon?: boolean;
}

interface State {
    ekspandert: boolean;
    vedleggSendt: boolean;
    renderInnhold: boolean;
}

class EttersendelseEkspanderbart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            ekspandert: false,
            vedleggSendt: false,
            renderInnhold: false,
        };
    }

    toggleEkspandering() {
        this.setState({ekspandert: !this.state.ekspandert});
    }

    onAnimasjonFerdig() {
        if (this.state.vedleggSendt === true && this.state.ekspandert === false && this.props.onEttersendelse) {
            this.setState({vedleggSendt: false});
            this.props.onEttersendelse();
        }

        if (this.state.renderInnhold !== this.state.ekspandert) {
            this.setState({renderInnhold: this.state.ekspandert});
        }
    }

    onEttersendelse() {
        this.setState({ekspandert: false, vedleggSendt: true});
    }

    render() {
        return (
            <span className="ettersendelse__vedlegg__ekspandert_wrapper">
                {this.props.kunGenerellDokumentasjon && (
                    <AvsnittMedMarger
                        venstreIkon={MargIkoner.DOKUMENTER}
                        hoyreIkon={this.state.ekspandert ? MargIkoner.CHEVRON_OPP : MargIkoner.CHEVRON_NED}
                        onClick={() => this.toggleEkspandering()}
                    >
                        {this.props.children}
                    </AvsnittMedMarger>
                )}

                {!this.props.kunGenerellDokumentasjon && (
                    <AvsnittMedMarger
                        venstreIkon={MargIkoner.ADVARSEL}
                        hoyreIkon={this.state.ekspandert ? MargIkoner.CHEVRON_OPP : MargIkoner.CHEVRON_NED}
                        onClick={() => this.toggleEkspandering()}
                    >
                        {this.props.children}
                    </AvsnittMedMarger>
                )}

                <UnmountClosed
                    isOpened={this.state.ekspandert}
                    onRest={() => this.onAnimasjonFerdig()}
                    className={
                        "ettersendelse__vedlegg " +
                        (this.state.ekspandert ? "ettersendelse__vedlegg__ekspandert " : " ")
                    }
                >
                    {this.state.renderInnhold && (
                        <>
                            <AvsnittMedMarger className="ettersendelse__vedlegg__header">
                                {!this.props.kunGenerellDokumentasjon && this.props.ettersendelseAktivert && (
                                    <FormattedMessage id="ettersendelse.mangler_info" />
                                )}
                                {!this.props.ettersendelseAktivert && (
                                    <FormattedMessage id="ettersendelse.mangler_info_manuell" />
                                )}
                            </AvsnittMedMarger>

                            <EttersendelseVedleggListe
                                ettersendelseAktivert={this.props.ettersendelseAktivert}
                                onEttersendelse={() => this.onEttersendelse()}
                            />
                        </>
                    )}
                </UnmountClosed>
            </span>
        );
    }
}

export default EttersendelseEkspanderbart;
