import { Faktum } from "./faktaTypes";

export function finnFaktum(faktumKey: string, fakta: Faktum[]): Faktum {
	const faktum = fakta.filter((f: Faktum) => {
		return f.key === faktumKey;
	});
	if (faktum.length === 0) {
		throw new Error("Faktum ikke funnet: " + faktumKey);
	}
	return faktum[0];
}

export function finnFakta(faktumKey: string, fakta: Faktum[]): Faktum[] {
	return fakta.filter((faktum) => faktum.key === faktumKey);
}
