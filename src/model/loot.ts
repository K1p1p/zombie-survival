import TransformModel from "./transform";

export interface LootModel {
    name: string;
    itemType: LOOT_TYPE;
    transform: TransformModel;
}

export enum LOOT_TYPE {
    MEDKIT
}