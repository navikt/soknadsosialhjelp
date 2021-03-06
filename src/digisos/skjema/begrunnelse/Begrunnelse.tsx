import * as React from "react";
import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

import {Begrunnelse as BegrunnelseType} from "./begrunnelseTypes";
import {useIntl} from "react-intl";
import {maksLengde} from "../../../nav-soknad/validering/valideringer";
import Sporsmal, {LegendTittleStyle} from "../../../nav-soknad/components/sporsmal/Sporsmal";
import TextareaEnhanced from "../../../nav-soknad/faktum/TextareaEnhanced";
import {onEndretValideringsfeil} from "../../redux/soknadsdata/soknadsdataContainerUtils";
import {SoknadsSti, oppdaterSoknadsdataSti} from "../../redux/soknadsdata/soknadsdataReducer";
import {ValideringsFeilKode} from "../../redux/validering/valideringActionTypes";
import {replaceDotWithUnderscore} from "../../../nav-soknad/utils";

import {State} from "../../redux/reducers";
import {clearValideringsfeil, setValideringsfeil} from "../../redux/validering/valideringActions";
import {hentSoknadsdata, lagreSoknadsdata} from "../../redux/soknadsdata/soknadsdataActions";

const MAX_CHARS_BEGRUNNELSE = 600;
const MAX_CHARS = 500;
const FAKTUM_KEY_HVA = "begrunnelse.hva";
const FAKTUM_KEY_HVORFOR = "begrunnelse.hvorfor";
const HVA_SOKES_OM = "hvaSokesOm";
const HVORFOR_SOKE = "hvorforSoke";

const BegrunnelseSkjema = () => {
    const behandlingsId = useSelector((state: State) => state.soknad.behandlingsId);
    const soknadsdata = useSelector((state: State) => state.soknadsdata);
    const feil = useSelector((state: State) => state.validering.feil);

    const dispatch = useDispatch();

    const intl = useIntl();

    useEffect(() => {
        if (behandlingsId) {
            dispatch(clearValideringsfeil(FAKTUM_KEY_HVA));
            dispatch(clearValideringsfeil(FAKTUM_KEY_HVORFOR));
            dispatch(hentSoknadsdata(behandlingsId, SoknadsSti.BEGRUNNELSE));
        }
    }, [behandlingsId, dispatch]);

    const onChange = (value: string, key: string) => {
        if (key === HVA_SOKES_OM) {
            soknadsdata.begrunnelse.hvaSokesOm = value;
        }
        if (key === HVORFOR_SOKE) {
            soknadsdata.begrunnelse.hvorforSoke = value;
        }
        dispatch(oppdaterSoknadsdataSti(SoknadsSti.BEGRUNNELSE, soknadsdata.begrunnelse));

        if (key === HVA_SOKES_OM) {
            validerTekstfeltVerdi(value, FAKTUM_KEY_HVA, MAX_CHARS);
        }
        if (key === HVORFOR_SOKE) {
            validerTekstfeltVerdi(value, FAKTUM_KEY_HVORFOR, MAX_CHARS_BEGRUNNELSE);
        }
    };

    const lagreHvisGyldig = () => {
        if (behandlingsId) {
            const {hvaSokesOm, hvorforSoke} = soknadsdata.begrunnelse;
            const feilmeldingHva: ValideringsFeilKode | undefined = validerTekstfeltVerdi(
                hvaSokesOm,
                FAKTUM_KEY_HVA,
                MAX_CHARS
            );
            const feilmeldingHvorfor: ValideringsFeilKode | undefined = validerTekstfeltVerdi(
                hvorforSoke,
                FAKTUM_KEY_HVORFOR,
                MAX_CHARS_BEGRUNNELSE
            );

            if (!feilmeldingHva && !feilmeldingHvorfor) {
                const begrunnelse: BegrunnelseType = {hvaSokesOm, hvorforSoke};
                dispatch(lagreSoknadsdata(behandlingsId, SoknadsSti.BEGRUNNELSE, begrunnelse));
            }
        }
    };

    const validerTekstfeltVerdi = (verdi: string, faktumKey: string, max: number): ValideringsFeilKode | undefined => {
        const feilkode: ValideringsFeilKode | undefined = maksLengde(verdi, max);
        onEndretValideringsfeil(feilkode, faktumKey, feil, () => {
            feilkode ? dispatch(setValideringsfeil(feilkode, faktumKey)) : dispatch(clearValideringsfeil(faktumKey));
        });
        return feilkode;
    };

    const begrunnelse = soknadsdata.begrunnelse;
    const faktumKeyHvaId = replaceDotWithUnderscore(FAKTUM_KEY_HVA);
    const faktumKeyHvorforId = replaceDotWithUnderscore(FAKTUM_KEY_HVORFOR);
    return (
        <div>
            <Sporsmal sprakNokkel={FAKTUM_KEY_HVA} legendTittelStyle={LegendTittleStyle.FET_NORMAL} visLedetekst={true}>
                <TextareaEnhanced
                    id={faktumKeyHvaId}
                    placeholder={intl.formatMessage({
                        id: "begrunnelse.hva.placeholder",
                    })}
                    onChange={(evt: any) => onChange(evt.target.value, HVA_SOKES_OM)}
                    onBlur={() => lagreHvisGyldig()}
                    faktumKey="begrunnelse.hva"
                    labelId="begrunnelse.hva.label"
                    hideLabel={true}
                    maxLength={MAX_CHARS}
                    value={begrunnelse.hvaSokesOm ? begrunnelse.hvaSokesOm : ""}
                />
            </Sporsmal>
            <Sporsmal
                sprakNokkel={FAKTUM_KEY_HVORFOR}
                legendTittelStyle={LegendTittleStyle.FET_NORMAL}
                visLedetekst={true}
            >
                <TextareaEnhanced
                    id={faktumKeyHvorforId}
                    placeholder={intl.formatMessage({
                        id: "begrunnelse.hvorfor.placeholder",
                    })}
                    onChange={(evt: any) => onChange(evt.target.value, HVORFOR_SOKE)}
                    onBlur={() => lagreHvisGyldig()}
                    faktumKey="begrunnelse.hvorfor"
                    labelId="begrunnelse.hvorfor.label"
                    hideLabel={true}
                    maxLength={MAX_CHARS_BEGRUNNELSE}
                    value={begrunnelse.hvorforSoke ? begrunnelse.hvorforSoke : ""}
                />
            </Sporsmal>
        </div>
    );
};

export {BegrunnelseSkjema};

export default BegrunnelseSkjema;
