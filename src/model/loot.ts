import TransformModel from "./transform";

export interface LootModel {
    itemType: LOOT_TYPE;
    transform: TransformModel;
}

export enum LOOT_TYPE {
    MEDKIT
}