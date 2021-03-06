import * as React from "react";
import {
    AntallRader,
    InputType,
    Opplysning,
    OpplysningRad,
    OpplysningSpc,
} from "../../redux/okonomiskeOpplysninger/opplysningerTypes";
import {Valideringsfeil, ValideringsFeilKode} from "../../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import {getSpcForOpplysning, getTomVedleggRad} from "../../redux/okonomiskeOpplysninger/opplysningerUtils";
import {Column, Row} from "nav-frontend-grid";
import InputEnhanced from "../../../nav-soknad/faktum/InputEnhanced";
import {
    lagreOpplysningHvisGyldigAction,
    updateOpplysning,
} from "../../redux/okonomiskeOpplysninger/opplysningerActions";
import Lenkeknapp from "../../../nav-soknad/components/lenkeknapp/Lenkeknapp";
import {clearValideringsfeil, setValideringsfeil} from "../../redux/validering/valideringActions";
import {erTall} from "../../../nav-soknad/validering/valideringer";
import {getFeilForOpplysning} from "../../redux/okonomiskeOpplysninger/opplysningerSaga";
import {State} from "../../redux/reducers";

export const erGyldigTall = (input: string): boolean => {
    return !erTall(input, true) && parseInt(input, 10) < 2147483648;
};

const TabellView = (props: {opplysning: Opplysning; gruppeIndex: number}) => {
    const behandlingsId = useSelector((state: State) => state.soknad.behandlingsId);
    const feil = useSelector((state: State) => state.validering.feil);

    const dispatch = useDispatch();

    const handleChange = (input: string, radIndex: number, inputFelt: InputType, key: string) => {
        const opplysningUpdated: Opplysning = {...props.opplysning};
        const raderUpdated: OpplysningRad[] = props.opplysning.rader.map((e) => ({
            ...e,
        }));
        raderUpdated[radIndex][inputFelt] = input;
        opplysningUpdated.rader = raderUpdated;

        if (inputFelt !== InputType.BESKRIVELSE) {
            if (erGyldigTall(input) || input === "") {
                dispatch(clearValideringsfeil(key));
            }
        }
        dispatch(updateOpplysning(opplysningUpdated));
    };

    const handleBlur = (radIndex: number, inputFelt: InputType, key: string) => {
        if (behandlingsId) {
            const input = props.opplysning.rader[radIndex][inputFelt];

            if (inputFelt !== "beskrivelse" && input && input !== "" && !erGyldigTall(input)) {
                dispatch(setValideringsfeil(ValideringsFeilKode.ER_TALL, key));
                dispatch(updateOpplysning(props.opplysning));
            } else {
                dispatch(lagreOpplysningHvisGyldigAction(behandlingsId, props.opplysning, feil));
            }
        }
    };

    const handleLeggTilRad = () => {
        const opplysningUpdated: Opplysning = {...props.opplysning};
        const raderUpdated: OpplysningRad[] = props.opplysning.rader.map((e) => ({
            ...e,
        }));
        raderUpdated.push(getTomVedleggRad());
        opplysningUpdated.rader = raderUpdated;
        dispatch(updateOpplysning(opplysningUpdated));
    };

    const handleFjernRad = (radIndex: number, valideringsKey: string) => {
        if (behandlingsId) {
            const opplysningUpdated: Opplysning = {...props.opplysning};
            const raderUpdated: OpplysningRad[] = props.opplysning.rader.map((e) => ({
                ...e,
            }));
            raderUpdated.splice(radIndex, 1);
            opplysningUpdated.rader = raderUpdated;
            fjernAlleFeilForOpplysning(feil, valideringsKey);
            validerAlleInputfelterPaOpplysning(opplysningUpdated, props.opplysning);
            const feilUpdated = getOppdatertListeAvFeil(feil, valideringsKey, radIndex);
            dispatch(lagreOpplysningHvisGyldigAction(behandlingsId, opplysningUpdated, feilUpdated));
        }
    };

    const getOppdatertListeAvFeil = (feil: Valideringsfeil[], valideringsKey: string, radIndex: number) => {
        const feilUpdated = feil.filter(
            (f) =>
                f.faktumKey !== valideringsKey + ".beskrivelse." + radIndex &&
                f.faktumKey !== valideringsKey + ".belop." + radIndex &&
                f.faktumKey !== valideringsKey + ".brutto." + radIndex &&
                f.faktumKey !== valideringsKey + ".netto." + radIndex &&
                f.faktumKey !== valideringsKey + ".avdrag." + radIndex &&
                f.faktumKey !== valideringsKey + ".renter." + radIndex
        );
        return feilUpdated;
    };

    const validerAlleInputfelterPaOpplysning = (opplysningUpdated: Opplysning, opplysning: Opplysning) => {
        opplysningUpdated.rader.forEach((rad: OpplysningRad, index: number) => {
            Object.keys(rad).forEach((key: string) => {
                switch (key) {
                    case InputType.BELOP: {
                        setValideringsfeilHvisUgyldigTall(InputType.BELOP, rad[InputType.BELOP], opplysning, index);
                        break;
                    }
                    case InputType.BRUTTO: {
                        setValideringsfeilHvisUgyldigTall(InputType.BRUTTO, rad[InputType.BRUTTO], opplysning, index);
                        break;
                    }
                    case InputType.NETTO: {
                        setValideringsfeilHvisUgyldigTall(InputType.NETTO, rad[InputType.NETTO], opplysning, index);
                        break;
                    }
                    case InputType.AVDRAG: {
                        setValideringsfeilHvisUgyldigTall(InputType.AVDRAG, rad[InputType.AVDRAG], opplysning, index);
                        break;
                    }
                    case InputType.RENTER: {
                        setValideringsfeilHvisUgyldigTall(InputType.RENTER, rad[InputType.RENTER], opplysning, index);
                        break;
                    }
                    default: {
                    }
                }
            });
        });
    };

    const setValideringsfeilHvisUgyldigTall = (
        key: InputType,
        value: string,
        opplysning: Opplysning,
        index: number
    ) => {
        const spc: OpplysningSpc | undefined = getSpcForOpplysning(opplysning.type);
        if (spc) {
            if (value !== null && value !== "" && !erGyldigTall(value)) {
                const validationKey: string = `${spc.textKey}.${key}.${index}`;
                dispatch(setValideringsfeil(ValideringsFeilKode.ER_TALL, validationKey));
            }
        }
    };

    const fjernAlleFeilForOpplysning = (feil: Valideringsfeil[], valideringsKey: string) => {
        const feilForOpplysning = getFeilForOpplysning(feil, valideringsKey);
        feilForOpplysning.forEach((f: Valideringsfeil) => {
            dispatch(clearValideringsfeil(f.faktumKey));
        });
    };

    const opplysningSpc: OpplysningSpc | undefined = getSpcForOpplysning(props.opplysning.type);
    const textKey = opplysningSpc ? opplysningSpc.textKey : "";

    const innhold: JSX.Element[] = props.opplysning.rader.map((vedleggRad: OpplysningRad, radIndex: number) => {
        const skalViseFjerneRadKnapp = radIndex > 0;
        const inputs = opplysningSpc
            ? opplysningSpc.radInnhold.map((inputType: InputType) => {
                  const key: string = `${textKey}.${inputType}.${radIndex}`;
                  const text: string = `${textKey}.${inputType}`;
                  const id: string = key.replace(/\./gi, "_");

                  return (
                      <Column xs={"12"} md={"6"} key={key}>
                          <InputEnhanced
                              id={id}
                              onChange={(input: string) => handleChange(input, radIndex, inputType, key)}
                              onBlur={() => handleBlur(radIndex, inputType, key)}
                              verdi={vedleggRad[inputType] ? vedleggRad[inputType] : ""}
                              required={false}
                              bredde={inputType === InputType.BESKRIVELSE ? "L" : "S"}
                              faktumKey={text}
                              faktumIndex={radIndex}
                              maxLength={inputType === InputType.BESKRIVELSE ? 100 : 8}
                          />
                      </Column>
                  );
              })
            : null;

        return (
            <Row key={radIndex} className="opplysning__row">
                {inputs}

                {skalViseFjerneRadKnapp && (
                    <Lenkeknapp
                        onClick={() => {
                            handleFjernRad(radIndex, textKey);
                        }}
                        id={radIndex + "_fjern_lenke"}
                    >
                        Fjern
                    </Lenkeknapp>
                )}
            </Row>
        );
    });

    if (innhold) {
        return (
            <div className="container--noPadding container-fluid">
                {innhold}
                {opplysningSpc && opplysningSpc.antallRader === AntallRader.FLERE && (
                    <Lenkeknapp onClick={() => handleLeggTilRad()} stil="add" id={props.gruppeIndex + "_link"}>
                        Legg til
                    </Lenkeknapp>
                )}
            </div>
        );
    }
    return null;
};

export default TabellView;
