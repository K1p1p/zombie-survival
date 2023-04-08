import { GUN_ID } from "./gun";
import TransformModel from "./transform";

export interface LootModel<T=any> {
    name: string;
    itemType: LOOT_TYPE;
    transform: TransformModel;
    extraData?: T;
}

export enum LOOT_TYPE {
    MEDKIT,
    GUN
}

export interface LootModelExtraDataForGun {
    id: GUN_ID;
    currentAmmo: number;
}