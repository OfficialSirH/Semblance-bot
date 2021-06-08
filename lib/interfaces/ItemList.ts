export interface ItemList {
    entropy: EntropyList;
    idea: IdeaList;
}
export type EntropyList = Record<string, ItemDefinitions>;
export type IdeaList = Record<string, ItemDefinitions>;
export interface ItemDefinitions {
    price: number;
}