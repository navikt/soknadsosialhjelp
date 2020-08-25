import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {FormattedHTMLMessage, useIntl} from "react-intl";
import {useSelector, useDispatch} from "react-redux";
import DocumentTitle from "react-document-title";
import {Innholdstittel} from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import {useEffect} from "react";
import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";

import Feiloppsummering from "../components/validering/Feiloppsummering";
import Knapperad from "../components/knapperad";
import {SkjemaConfig, SkjemaSteg, SkjemaStegType} from "../../digisos/redux/soknad/soknadTypes";
import {ValideringsFeilKode} from "../../digisos/redux/reduxTypes";
import {setVisBekreftMangler} from "../../digisos/redux/oppsummering/oppsummeringActions";
import {getIntlTextOrKey, scrollToTop} from "../utils";
import {avbrytSoknad, resetSendSoknadServiceUnavailable, sendSoknad} from "../../digisos/redux/soknad/soknadActions";
import {gaTilbake, gaVidere, tilSteg} from "../../digisos/redux/navigasjon/navigasjonActions";
import {loggInfo} from "../../digisos/redux/navlogger/navloggerActions";
import AppBanner from "../components/appHeader/AppHeader";
import {
    clearAllValideringsfeil,
    setValideringsfeil,
    visValideringsfeilPanel,
} from "../../digisos/redux/validering/valideringActions";
import {NavEnhet} from "../../digisos/skjema/personopplysninger/adresse/AdresseTypes";
import {State} from "../../digisos/redux/reducers";
import {erPaStegEnOgValgtNavEnhetErUgyldig, sjekkOmValgtNavEnhetErGyldig} from "./containerUtils";

const stopEvent = (evt: React.FormEvent<any>) => {
    evt.stopPropagation();
    evt.preventDefault();
};

const stopKeyCodeEvent = (evt: any) => {
    const key = evt.key;
    if (key === "Enter") {
        evt.stopPropagation();
        evt.preventDefault();
    }
};

const StegMedNavigasjon = (
    props: {
        stegKey: string;
        skjemaConfig: SkjemaConfig;
        pending?: boolean;
        ikon?: React.ReactNode;
        children?: any;
    } & RouteComponentProps
) => {
    const soknadsdata = useSelector((state: State) => state.soknadsdata);
    const behandlingsId = useSelector((state: State) => state.soknad.behandlingsId);
    const soknad = useSelector((state: State) => state.soknad);
    const validering = useSelector((state: State) => state.validering);
    const oppsummeringBekreftet = useSelector((state: State) => state.oppsummering.bekreftet);

    const dispatch = useDispatch();

    const intl = useIntl();

    useEffect(() => {
        scrollToTop();
    }, []);

    const nedetidstart = soknad.nedetid ? soknad.nedetid.nedetidStartText : "";
    const nedetidslutt = soknad.nedetid ? soknad.nedetid.nedetidSluttText : "";
    const isNedetid = soknad.nedetid ? soknad.nedetid.isNedetid : false;

    const loggAdresseTypeTilGrafana = () => {
        const adresseTypeValg = soknadsdata.personalia.adresser.valg;
        if (adresseTypeValg) {
            dispatch(loggInfo("klikk--" + adresseTypeValg));
        }
    };

    const handleGaTilSkjemaSteg = (aktivtSteg: SkjemaSteg | undefined, steg: number) => {
        if (aktivtSteg && behandlingsId) {
            const {feil} = validering;

            const valgtNavEnhet = finnSoknadsMottaker();
            if (erPaStegEnOgValgtNavEnhetErUgyldig(aktivtSteg.stegnummer, valgtNavEnhet)) {
                dispatch(setValideringsfeil(ValideringsFeilKode.SOKNADSMOTTAKER_PAKREVD, "soknadsmottaker"));
                if (valgtNavEnhet == null) {
                    dispatch(loggInfo("Ingen navenhet valgt"));
                } else {
                    dispatch(loggInfo(`Ugyldig navenhet valgt: ${valgtNavEnhet.enhetsnr} ${valgtNavEnhet.enhetsnavn}`));
                }
                dispatch(visValideringsfeilPanel());
            } else {
                if (feil.length === 0) {
                    dispatch(clearAllValideringsfeil());
                    dispatch(tilSteg(steg, behandlingsId));
                } else {
                    dispatch(visValideringsfeilPanel());
                }
            }
        }
    };

    const handleGaVidere = (aktivtSteg: SkjemaSteg) => {
        if (behandlingsId) {
            if (aktivtSteg.type === SkjemaStegType.oppsummering) {
                if (oppsummeringBekreftet) {
                    loggAdresseTypeTilGrafana();
                    dispatch(sendSoknad(behandlingsId));
                } else {
                    dispatch(setVisBekreftMangler(true));
                }
                return;
            }

            const {feil} = validering;
            const valgtNavEnhet = finnSoknadsMottaker();

            if (erPaStegEnOgValgtNavEnhetErUgyldig(aktivtSteg.stegnummer, valgtNavEnhet)) {
                dispatch(setValideringsfeil(ValideringsFeilKode.SOKNADSMOTTAKER_PAKREVD, "soknadsmottaker"));
                if (valgtNavEnhet == null) {
                    dispatch(loggInfo("Ingen navenhet valgt"));
                } else {
                    dispatch(loggInfo(`Ugyldig navenhet valgt: ${valgtNavEnhet.enhetsnr} ${valgtNavEnhet.enhetsnavn}`));
                }
                dispatch(visValideringsfeilPanel());
            } else {
                if (feil.length === 0) {
                    sjekkOmValgtNavEnhetErGyldig(behandlingsId, dispatch, () => {
                        dispatch(gaVidere(aktivtSteg.stegnummer, behandlingsId));
                    });
                } else {
                    dispatch(visValideringsfeilPanel());
                }
            }
        }
    };

    const finnSoknadsMottaker = () => {
        return soknadsdata.personalia.navEnhet as NavEnhet | null;
    };

    const finnKommunenavn = () => {
        const valgtNavEnhet = soknadsdata.personalia.navEnhet as NavEnhet | null;
        if (valgtNavEnhet === null) {
            return "Din";
        }
        return valgtNavEnhet.kommunenavn;
    };

    const handleGaTilbake = (aktivtSteg: number) => {
        if (behandlingsId) {
            dispatch(clearAllValideringsfeil());
            dispatch(resetSendSoknadServiceUnavailable());
            dispatch(gaTilbake(aktivtSteg, behandlingsId));
        }
    };

    const nextButtonPending = soknad.sendSoknadPending;
    const {skjemaConfig, stegKey, ikon, children} = props;

    const {feil, visValideringsfeil} = validering;

    const aktivtStegConfig: SkjemaSteg | undefined = skjemaConfig.steg.find((s) => s.key === stegKey);

    const erOppsummering: boolean = aktivtStegConfig ? aktivtStegConfig.type === SkjemaStegType.oppsummering : false;
    const stegTittel = getIntlTextOrKey(intl, `${stegKey}.tittel`);
    const documentTitle = intl.formatMessage({
        id: skjemaConfig.tittelId,
    });
    const synligeSteg = skjemaConfig.steg.filter((s) => s.type === SkjemaStegType.skjema);

    const aktivtSteg: number = aktivtStegConfig ? aktivtStegConfig.stegnummer : 1;

    return (
        <div className="app-digisos informasjon-side">
            <AppBanner />
            <DocumentTitle title={`${stegTittel} - ${documentTitle}`} />
            {isNedetid && (
                <AlertStripe type="feil" style={{justifyContent: "center"}}>
                    <FormattedHTMLMessage
                        id="nedetid.alertstripe.infoside"
                        values={{
                            nedetidstart: nedetidstart,
                            nedetidslutt: nedetidslutt,
                        }}
                    />
                </AlertStripe>
            )}

            <div className="skjema-steg skjema-content">
                <div className="skjema-steg__feiloppsummering">
                    <Feiloppsummering
                        skjemanavn={skjemaConfig.skjemanavn}
                        valideringsfeil={feil}
                        visFeilliste={visValideringsfeil}
                    />
                </div>
                <form id="soknadsskjema" onSubmit={stopEvent} onKeyPress={stopKeyCodeEvent}>
                    {!erOppsummering ? (
                        <div className="skjema__stegindikator">
                            <Stegindikator
                                autoResponsiv={true}
                                kompakt={false}
                                aktivtSteg={aktivtSteg - 1}
                                steg={synligeSteg.map((s) => {
                                    return {
                                        label: intl.formatMessage({
                                            id: `${s.key}.tittel`,
                                        }),
                                        index: s.stegnummer - 1,
                                    };
                                })}
                                onChange={(s: number) => handleGaTilSkjemaSteg(aktivtStegConfig, s + 1)}
                            />
                        </div>
                    ) : null}
                    <div className="skjema-steg__ikon">{ikon}</div>
                    <div className="skjema-steg__tittel" tabIndex={-1}>
                        <Innholdstittel className="sourceSansProBold">{stegTittel}</Innholdstittel>
                    </div>

                    {children}

                    {soknad.visMidlertidigDeaktivertPanel && aktivtSteg !== 1 && !(aktivtSteg === 9 && isNedetid) && (
                        <AlertStripe type="feil">
                            <FormattedHTMLMessage
                                id="adresse.alertstripe.feil"
                                values={{
                                    kommuneNavn: finnKommunenavn(),
                                }}
                            />
                        </AlertStripe>
                    )}
                    {soknad.visIkkePakobletPanel && aktivtSteg !== 1 && !(aktivtSteg === 9 && isNedetid) && (
                        <AlertStripe type="advarsel">
                            <FormattedHTMLMessage
                                id="adresse.alertstripe.advarsel"
                                values={{
                                    kommuneNavn: finnKommunenavn(),
                                }}
                            />
                        </AlertStripe>
                    )}

                    {aktivtStegConfig && (
                        <Knapperad
                            gaViderePending={nextButtonPending}
                            gaVidereLabel={erOppsummering ? getIntlTextOrKey(intl, "skjema.knapper.send") : undefined}
                            gaVidere={() => handleGaVidere(aktivtStegConfig)}
                            gaTilbake={
                                aktivtStegConfig.stegnummer > 1
                                    ? () => handleGaTilbake(aktivtStegConfig.stegnummer)
                                    : undefined
                            }
                            avbryt={() => dispatch(avbrytSoknad())}
                            sendSoknadServiceUnavailable={soknad.sendSoknadServiceUnavailable}
                        />
                    )}

                    {soknad.showSendingFeiletPanel && aktivtSteg === 9 && (
                        <div role="alert">
                            <AlertStripe type="feil" style={{marginTop: "1rem"}}>
                                Vi klarte ikke sende søknaden din, grunnet en midlertidig teknsik feil. Vi ber deg prøve
                                igjen. Søknaden din er lagret og dersom problemet fortsetter kan du forsøke igjen
                                senere. Kontakt ditt NAV kontor dersom du er i en nødsituasjon.
                            </AlertStripe>
                        </div>
                    )}

                    {soknad.visMidlertidigDeaktivertPanel && isNedetid && aktivtSteg === 9 && (
                        <AlertStripe type="feil" style={{marginTop: "1rem"}}>
                            <FormattedHTMLMessage
                                id="nedetid.alertstripe.send"
                                values={{
                                    nedetidstart: nedetidstart,
                                    nedetidslutt: nedetidslutt,
                                }}
                            />
                        </AlertStripe>
                    )}
                </form>
            </div>
        </div>
    );
};

export default withRouter(StegMedNavigasjon);
