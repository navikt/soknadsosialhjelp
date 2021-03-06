import React from "react";
import Informasjonspanel, {InformasjonspanelIkon} from "../../../nav-soknad/components/informasjonspanel";
import {DigisosFarge} from "../../../nav-soknad/components/svg/DigisosFarger";
import {useDispatch} from "react-redux";
import {visLasteOppVedleggModal} from "../../redux/soknad/soknadActions";
import {OpplastingAvVedleggModal} from "./OpplastingAvVedleggModal";
import {FormattedMessage} from "react-intl";

export const OpplysningerIkkeBesvartPanel = () => {
    const dispatch = useDispatch();

    return (
        <div className="steg-ekstrainformasjon__infopanel">
            <Informasjonspanel ikon={InformasjonspanelIkon.HENSYN} farge={DigisosFarge.VIKTIG}>
                <p>
                    <FormattedMessage id="opplysninger.ikkebesvart.avsnitt1" />
                </p>
                <p>
                    <FormattedMessage id="opplysninger.ikkebesvart.avsnitt2" />
                </p>
                <button
                    type="button"
                    className="linkbutton linkbutton--normal"
                    onClick={() => {
                        dispatch(visLasteOppVedleggModal(true));
                    }}
                >
                    <FormattedMessage id="opplysninger.informasjon.lenke" />
                </button>
                <OpplastingAvVedleggModal />
            </Informasjonspanel>
        </div>
    );
};
