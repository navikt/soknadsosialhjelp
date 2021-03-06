import * as React from "react";
import Panel from "nav-frontend-paneler";
import Icon from "nav-frontend-ikoner-assets";
import {Innholdstittel, Systemtittel} from "nav-frontend-typografi";
import ProblemSirkel from "../svg/ProblemSirkel";

interface Props {
    tittel?: string;
    brukSystemtittel?: boolean;
    className?: string;
    ikon?: "standard" | "advarsel";
}

const Infoblokk: React.StatelessComponent<Props> = ({className, children, tittel, ikon, brukSystemtittel}) => {
    return (
        <Panel className={`skjema-infoblokk ${className}`}>
            <div className="skjema-infoblokk__content">
                <div className="skjema-infoblokk__icon">
                    {ikon === "advarsel" ? <ProblemSirkel /> : <Icon kind="info-sirkel" />}
                </div>
                {tittel && (
                    <div>
                        {brukSystemtittel ? (
                            <Systemtittel className="skjema-infoblokk__title">{tittel}</Systemtittel>
                        ) : (
                            <Innholdstittel className="skjema-infoblokk__title">{tittel}</Innholdstittel>
                        )}
                        <div className="skjema-infoblokk__dash" />
                    </div>
                )}
                <div className="skjema-infoblokk__tekst">{children}</div>
            </div>
        </Panel>
    );
};

export default Infoblokk;
