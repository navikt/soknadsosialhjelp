import * as React from "react";

import FaktumRadio from "../../../nav-soknad/faktum/RadioFaktum";
import SporsmalFaktum from "../../../nav-soknad/faktum/SporsmalFaktum";
import NivaTreSkjema from "../../../nav-soknad/components/nivaTreSkjema/index";
import PersonFaktum from "../../../nav-soknad/faktum/PersonFaktum";
import { Faktum } from "../../../nav-soknad/types";
import {
	faktumIsSelected,
	getPropertyVerdi,
	radioCheckKeys
} from "../../../nav-soknad/utils";
import { FaktumComponentProps } from "../../../nav-soknad/redux/faktaReducer";
import BelopFaktum from "../../../nav-soknad/faktum/typedInput/BelopFaktum";
import { inputKeys } from "../../../nav-soknad/utils/faktumUtils";

interface BarnTypes {
	faktum: Faktum;
}

export default class Barn extends React.Component<
	FaktumComponentProps & BarnTypes,
	{}
> {
	render() {
		const { fakta, faktum } = this.props;
		const faktumKey = faktum.key;
		const borInfo = radioCheckKeys(`${faktumKey}.borsammen`);
		const hvormye = inputKeys(`${faktumKey}.grad`);
		const faktumId = faktum.faktumId;
		return (
			<div className="blokk">
				<SporsmalFaktum faktumKey={faktumKey}>
					<PersonFaktum
						faktumKey={faktumKey}
						brukProperties={true}
						faktumId={faktumId}
					/>
					<SporsmalFaktum faktumKey={borInfo.faktum}>
						<FaktumRadio
							faktumKey={faktumKey}
							value="true"
							property="borsammen"
							faktumId={faktumId}
						/>
						<NivaTreSkjema
							visible={faktumIsSelected(
								getPropertyVerdi(fakta, borInfo.faktum, "borsammen", faktumId)
							)}>
							<SporsmalFaktum faktumKey={hvormye.faktum}>
								<BelopFaktum
									faktumKey={faktumKey}
									faktumId={faktumId}
									property="grad"
									maxLength={3}
									kunHeltall={true}
									bredde="xs"
								/>
							</SporsmalFaktum>
						</NivaTreSkjema>
						<FaktumRadio
							faktumKey={faktumKey}
							value="false"
							property="borsammen"
							faktumId={faktumId}
						/>
					</SporsmalFaktum>
				</SporsmalFaktum>
			</div>
		);
	}
}
