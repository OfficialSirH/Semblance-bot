export interface ItemList {
	entropy: EntropyList;
	ideas: IdeaList;
	fossils: FossilList;
}
export type EntropyList = Record<string, ItemDefinitions>;
export type IdeaList = Record<string, ItemDefinitions>;
export type FossilList = Record<string, ItemDefinitions>;
export interface ItemDefinitions {
	price: number;
}
